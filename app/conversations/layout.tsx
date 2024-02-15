import Sidebar from "@/components/sidebar";
import ConversationList, { ConversationListSkeleton } from "./components/ConversationList";
import getConversations from "@/actions/getConversations";
import getUsers from "@/actions/getUsers";
import { Suspense } from "react";

export default async function ConversationLayout({
    children
}: {
    children: React.ReactNode
}) {
    const conversations = await getConversations();
    const users = await getUsers();
    return (
        <Sidebar>
            <div className="h-full">
                <Suspense fallback={<ConversationListSkeleton />}>
                    <ConversationList
                        users={users}
                        initialItems={conversations}
                    />
                </Suspense>
                {children}
            </div>
        </Sidebar>
    )
}