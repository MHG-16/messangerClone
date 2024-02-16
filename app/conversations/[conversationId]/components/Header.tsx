"use client";

import Avatar, { AvatarSkeleton } from "@/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import { User, Conversation } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiEllipsisHorizontal, HiChevronLeft } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/components/AvatarGroup";
import { Skeleton } from "@/components/ui/skeleton";
import useActiveList from "@/hooks/useActiveList";

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
  
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
    console.log(isActive)
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
        return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

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
                {conversation.isGroup ? (
                    <AvatarGroup users={conversation.users} />
                ) : (
                    <Avatar user={otherUser} />
                )}
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

export const HeaderSkeleton = () => {
    return (
        <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
                <span className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer">
                    <HiChevronLeft size={32} />
                </span>
                <AvatarSkeleton />
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-16 h-4 bg-gray-400" />
                    <Skeleton className="W-16 h-2 bg-gray-400" />
                </div>
            </div>
            <HiEllipsisHorizontal size={32} className="text-sky-500 cursor-pointer hover:text-sky-600 transition"/>
        </div>
    )
}

export default Header