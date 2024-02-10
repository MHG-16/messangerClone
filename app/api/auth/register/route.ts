import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            email,
            name,
            password
        } = body;

        if (!email || !name || !password) { 
            return new Response("Missing parameters", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await db.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        return NextResponse.json(user);
    } catch (err) {
        console.error(err);
        return new NextResponse("Internal error: " + err, { status: 500});
    }
}