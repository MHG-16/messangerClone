import getUsers from "@/actions/getUsers";
import Sidebar from "@/components/sidebar";
import UsersList, { UsersListSkeleton } from "./components/UsersList";
import { Suspense } from "react";


export default async function UsersLayout(
    {children}: {children: React.ReactNode}
) {
    const users = await getUsers();
    return (
        <Sidebar> 
            <div className="h-full">
                <Suspense fallback={<UsersListSkeleton />}>
                    <UsersList items={users}/>
                </Suspense>
                {children}
            </div>
        </Sidebar>
    )
}