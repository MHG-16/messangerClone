"use server";

import { db } from "@/lib/db";
import getSession from "./getSession";

const getCurrentUser = async () => {
    try {
        const session = await getSession();
        if (!session?.user?.email) return null; // Not logged in

        const currentUser = await prisma?.user.findUnique( {
            where: {
                email: session.user.email as string
            }
        });

        if (!currentUser) return null;

        return currentUser;
    } catch (error: any) {
        return null;
    }
}