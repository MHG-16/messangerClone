"use client";

import Avatar from "@/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import { User, Conversation } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiEllipsisHorizontal, HiChevronLeft } from "react-icons/hi2";
import ProfileDrawer from "../../components/ProfileDrawer";

interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    } 
}

const Header: React.FC<HeaderProps> = ({
    conversation
}) => {
  const otherUser = useOtherUser(conversation);
  const [drawOpen, setdrawOpen] = useState(false);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
        return `${conversation.users.length} members`;
    }

    return "Active"
  }, [conversation]);

  return (
    <>
        <ProfileDrawer 
            data={conversation}
            isOpen={drawOpen}
            onClose={() => setdrawOpen(false)}
        />
        <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
                <Link
                    className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer" 
                    href="/conversations"
                >
                    <HiChevronLeft size={32} />
                </Link>
                <Avatar user={otherUser} />
                <div className="flex flex-col">
                    <div>
                        {conversation.name || otherUser.name}
                    </div>
                    <div className="text-sm font-light text-neutral-500">
                        {statusText}
                    </div>
                </div>
            </div>
            <HiEllipsisHorizontal size={32} onClick={() => setdrawOpen(true)} className="text-sky-500 cursor-pointer hover:text-sky-600 transition"/>
        </div>
    </>
  )
}

export default Header