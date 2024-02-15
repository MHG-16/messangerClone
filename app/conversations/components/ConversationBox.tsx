import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";

import Avatar, { AvatarSkeleton } from "@/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import { FullConversationType } from "@/types"
import AvatarGroup from "@/components/AvatarGroup";
import { Skeleton } from "@/components/ui/skeleton";


interface ConversationBoxProps {
    data: FullConversationType;
    selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected
}) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push("/conversations/" + data.id);
    }, [data.id, router]);

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];

        return messages[messages.length - 1]
    }, [data.messages]);

    const userEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session?.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if(!lastMessage) {
            return false;
        }

        const seenArray = lastMessage.seen || [];

        if (!userEmail) {
            return false;
        }

        return seenArray.filter((user) => user.email === userEmail).length !== 0;
    }, [lastMessage, userEmail]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return "Sent an image";
        }

        if(lastMessage?.body) {
            return lastMessage.body;
        }

        return "Start a conversation"
    }, [lastMessage?.image, lastMessage?.body]);

    return (
    <div onClick={handleClick} className={clsx(
        "w-full relative flex items-center p-3 space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer",
        selected ? "bg-neutral-100" : "bg-white"
    )}>
        {
            data.isGroup ? (
                <AvatarGroup users={data.users} />
            ) : (
                <Avatar user={otherUser} />
            )
        }
        <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-md font-medium text-gray-900">
                        {data.name || otherUser.name}
                    </p>
                    {lastMessage?.createdAt && (
                        <p className="rext-xs text-gray-400 font-light">
                            {format(new Date(lastMessage.createdAt), "p")}
                        </p>
                    )
                    }
                </div>
                <p className={clsx(
                    "truncate text-sm",
                    hasSeen ? "text-gray-500" : "text-black font-medium"
                    )}
                >
                    {lastMessageText}
                </p>
            </div>
        </div>
    </div>
  )
}

export const ConversationBoxSkeleton = () => {
    return (
        <div className="w-full relative flex items-center p-3 space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer bg-white">
            <AvatarSkeleton />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <Skeleton className="w-32 h-4 bg-stone-400" />
                    <Skeleton className="w-16 h-4 bg-stone-400" />
                </div>
                <Skeleton className="w-full h-8 bg-stone-400" />
            </div>
        </div>
    )
}

export default ConversationBox