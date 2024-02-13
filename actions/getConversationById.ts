import { db } from "@/lib/db";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (id: string) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
            return null;
        }

        const conversation = await db.conversation.findUnique({
            where: {id},
            include: {
                users: true,
            }
        });

        return conversation;
    } catch {
        return null;
    }
}

export default getConversationById;