"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { User } from "@prisma/client";

import useConversation from "@/hooks/useConversation";
import { FullConversationType } from "@/types";
import ConversationBox, { ConversationBoxSkeleton } from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";



interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,
    users
}) => {
  const session = useSession();
  const { conversationId, isOpen } = useConversation();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email]);

  useEffect(() => {
    if(!pusherKey) {
        return;
    }

    pusherClient.subscribe(pusherKey);
    const newConversationHandler = (conversation: FullConversationType) => {
        setItems((current) => {
            if(find(current, { id: conversation.id })) {
                return current
            }

            return [ conversation, ...current ]
        })
    };

    const updateConversationHandler = (conversation: FullConversationType) => {
        setItems((current) => current.map((currentConversation) => {
            if(currentConversation.id === conversation.id) {
                return {
                    ...currentConversation,
                    messages: conversation.messages
                }
            }
            return currentConversation;
        }))
    }

    const removeHandler = (conversation: FullConversationType) => {
        setItems((current) => {
            return [ ...current.filter((currentConversation) => currentConversation.id !== conversation.id )]
        });

        if (conversationId == conversation.id) {
            router.push("/conversations")
        }
    };

    pusherClient.bind("conversation:new", newConversationHandler);
    pusherClient.bind("conversation:update", updateConversationHandler);
    pusherClient.bind("conversation:remove", removeHandler);
    return () => {
        pusherClient.unsubscribe(pusherKey);
        pusherClient.unbind("conversation:new", newConversationHandler);
        pusherClient.unbind("conversation:update", updateConversationHandler);
    }
  }, [conversationId, pusherKey, router])
  return (
    <>
        <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        <aside className={clsx(`
            fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200
        `,
            isOpen ? "hidden" : "block w-full left-0"
        )}>
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-800">
                        Messages
                    </div>
                    <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <MdOutlineGroupAdd size={20} />
                    </div>
                </div>
                {items.map((item) => (
                    <ConversationBox 
                        key={item.id}
                        data={item} 
                        selected={conversationId === item.id}
                    />
                ))}
            </div>
        </aside>
    </>
  )
}

export const ConversationListSkeleton = () => {
    const { isOpen } = useConversation();

    return (
        <aside className={clsx(`
            fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200
            `,
            isOpen ? "hidden" : "block w-full left-0"
        )}>
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-800">
                        Messages
                    </div>
                    <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
                        <MdOutlineGroupAdd size={20} />
                    </div>
                </div>
                {[...Array(5)].map((index) => (<ConversationBoxSkeleton key={index}/>))}
            </div>            
        </aside>
    )
}

export default ConversationList