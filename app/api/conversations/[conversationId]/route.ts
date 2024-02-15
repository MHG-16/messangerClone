import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function DELETE (
    request: Request,
    { params } : { params: IParams }
) {
    try{
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        };

        const existingConversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!existingConversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const deletedConversation = await db.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        return new NextResponse("Deleted conversation", { status: 200});
    } catch (error: any) {
        console.error(error, "Error_CONVERSATION_DELETE");
    return new NextResponse("Internal Server Error", { status: 500 });
    }
}