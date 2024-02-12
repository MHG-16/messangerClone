// Import the getCurrentUser function and NextResponse from Next.js server components
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

// Import the database connection object
import { db } from "@/lib/db";

// Define the async POST request handler for the conversation creation endpoint
export async function POST(request: Request) {
  try {
    // Get the current user from the getCurrentUser function
    const currentUser = await getCurrentUser();

    // Parse the request body as JSON
    const body = await request.json();

    // Destructure the required fields from the request body
    const {
      userId, // The ID of the user to create a conversation with
      isGroup, // Whether the conversation is a group conversation or not
      members, // The list of members for a group conversation
      name, // The name of the group conversation
    } = body;

    // Check if the current user is authorized, if not return an unauthorized response
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate the group conversation data, if not valid return an invalid data response
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    // If the conversation is a group conversation, create a new conversation
    if (isGroup) {
      const newConversation = await db.conversation.create({
        data: {
          name, // Set the name of the conversation
          isGroup, // Set the conversation as a group conversation
          users: {
            connect: [
              // Connect all the members of the group conversation, including the current user
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true, // Include the users in the conversation in the response
        },
      });

      return NextResponse.json(newConversation); // Return the newly created conversation
    }

    // Find any existing conversations between the current user and the specified user
    const existingConversations = await db.conversation.findMany({
      where: {
        OR: [
          // Check if the conversation exists with the current user as the first user
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          // Check if the conversation exists with the current user as the second user
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    // If an existing conversation is found, return it
    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // If no existing conversation is found, create a new conversation between the current user and the specified user
    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [
            // Connect the current user and the specified user
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true, // Include the users in the conversation in the response
      },
    });

    return NextResponse.json(newConversation); // Return the newly created conversation
  } catch (error: any) {
    // If an error occurs, return an internal server error response
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
