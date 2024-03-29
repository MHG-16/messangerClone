"use client";
import { Suspense, useState } from "react";

import useRoutes from "@/hooks/useRoutes";
import DesktopItem from "./desktop-item";
import { User } from "@prisma/client";
import Avatar, { AvatarSkeleton } from "../Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSidebarProps {
  currentUser: User
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser
}) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal 
        currentUser={currentUser} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
      />
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {
              routes.map((route) => (
                <DesktopItem  
                  href={route.href}
                  label={route.label}
                  icon={route.icon}
                  active={route.active}
                  onClick={route.onClick}
                  key={route.label}/>
              ))
            }
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
            <div 
              onClick={() => setIsOpen(true)}
              className="cursor-pointer hover:opacity-75 transition"
            >
              <Suspense fallback={<AvatarSkeleton />}>
                <Avatar user={currentUser}/>
              </Suspense>
            </div>
        </nav>
      </div>
    </>
  )
}

export default DesktopSidebar