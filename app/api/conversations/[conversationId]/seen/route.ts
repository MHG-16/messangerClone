import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function POST(
    request: Request,
    { params } : { params : IParams}
) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;
        
        if(!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorizated", { status: 401 });
        }


        // Get the conversation
        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        });

        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 401 });
        }

        // Find the last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        // Update seen of last message
        const updatedMessage = await db.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        await pusherServer.trigger(currentUser.email, "conversation:update", {
            id: conversationId,
            messages: [updatedMessage]
        });

        if(lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!, "message:update", updatedMessage);

        return NextResponse.json(updatedMessage);
        
    } catch(error: any) {
        console.error(error, "Error post request");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}