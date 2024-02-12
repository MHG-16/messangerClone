import { authOptions } from "@/lib/config";
import { getServerSession } from "next-auth/next";


export default async function getSession() {
    return await getServerSession(authOptions);
}