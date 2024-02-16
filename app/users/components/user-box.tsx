import Avatar, { AvatarSkeleton } from "@/components/Avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

interface UserBoxProps {
    data: User;
}

const UserBox: React.FC<UserBoxProps> = ({
    data
}) => {
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const handleClick = useCallback(() => {
    startTransition(() => {
        axios.post("/api/conversations", {
            userId: data.id
        })
        .then((data) => router.push(`/conversations/${data.data.id}`))
    })
  }, [data.id, router])
  return (
    <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
    >
        <Avatar user={data}/>
        <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-900">
                        {data.name}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export const UserBoxSkeleton = () => {
    return (
        <div className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer">
            <AvatarSkeleton />
            <Skeleton className="bg-gray-500 w-32 h-4" />
        </div>
    )
} 
export default UserBox