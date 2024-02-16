import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { connect } from "http2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser?.email || !currentUser?.id ) {
            throw new Error("Unauthorizated")
        }
        const body = await request.json();
        const {
            message,
            image,
            conversationId
        } = body;

        const newMessage = await db.message.create({
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                },
            },
            include: {
                seen: true, 
                sender: true
            }
        });
        const updatedConversation = await db.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId, "messages:new", newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, "conversation:update", {
                id: conversationId,
                messages: [lastMessage]
            })
        })
        return NextResponse.json( newMessage );
        
    } catch (e: any) {
        console.log(e, "Internal method error");
        return new Response("Error server", { status: 500 });
    }
}