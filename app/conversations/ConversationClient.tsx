"use client";

import EmptyState from "@/components/emptyState";
import useConversation from "@/hooks/useConversation";
import clsx from "clsx";

const ConversationClient = () => {
  const { isOpen } = useConversation();
  return (
    <div className={clsx(
        "lg:pl-80 h-full lg:block",
        isOpen ? "block" : "hidden"
    )}>
        <EmptyState />
    </div>
  )
}

export default ConversationClient