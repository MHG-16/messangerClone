"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

interface AvatarProps {
    user?: User
}

const Avatar: React.FC<AvatarProps> = ({
    user
}) => {
  return (
    <div className="relative">
        <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
            <Image alt="Avatar" src={user?.image || "/images/placeholder.jpg"} fill/>
        </div>
        <div className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3"/>
    </div>
  )
}

export const AvatarSkeleton = () => {
  return (
    <div className="relative">
        <Skeleton className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11 bg-slate-500" />
    </div>
  )
}

export default Avatar