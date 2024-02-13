"use client";

import useOtherUser from "@/hooks/useOtherUser";
import { User, Conversation } from "@prisma/client";
import Link from "next/link";
import { useMemo } from "react";
import { HiChevronLeft } from "react-icons/hi";

interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    } 
}

const Header: React.FC<HeaderProps> = ({
    conversation
}) => {
  const otherUser = useOtherUser(conversation);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
        return `${conversation.users.length} members`;
    }

    return "Active"
  }, [conversation]);

  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
            <Link
                className="lg:hidden bloc text-sky-500 hover:text-sky-600 transition cursor-pointer" 
                href="/conversations"
            >
                <HiChevronLeft size={32} />
            </Link>
        </div>
    </div>
  )
}

export default Header