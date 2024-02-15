import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();

        const {
            name,
            image
        } = body;

        if (!currentUser?.id) {
            return new NextResponse("unauthorized", {status: 401})
        }

        const updatedUser = await db.user.update({
            where: { id: currentUser.id },
            data: {
                image: image,
                name: name,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {

    }
}