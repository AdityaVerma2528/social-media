import { NextResponse } from "next/server";
import prisma from "../../../../lib/db/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { followerId, followingId, followingAvatar, followingEmail } =
            body;

        if (
            !followerId ||
            !followingId ||
            !followingEmail ||
            !followingAvatar
        ) {
            return NextResponse.json(
                { error: "All the fields are required" },
                { status: 400 }
            );
        }

        const relation = await prisma.follows.create({
            data: {
                followerId,
                followingId,
                followingEmail,
                followingAvatar,
            },
        });

        return NextResponse.json(relation, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to set follower" },
            { status: 500 }
        );
    }
}
