import prisma from "../../../../lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { profileId, title, imageUrl, location } = body;

        if (!profileId || !title || !imageUrl || !location) {
            return NextResponse.json(
                { error: "All the fields are required" },
                { status: 400 }
            );
        }

        const newPost = await prisma.post.create({
            data: {
                profileId,
                title,
                imageUrl,
                location,
            },
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Error while creating post", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
