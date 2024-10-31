import prisma from "../../../../../lib/db/prisma";
import redis from "../../../../../lib/db/redis";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { email: string } }
) {
    const { email } = await params;

    try {
        const cachedUser = await redis.get(`user:${email}`);

        if (cachedUser) {
            return NextResponse.json(JSON.parse(cachedUser));
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profiles: {
                    include: {
                        posts: true,
                        followers: true,
                        following: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        // Cache the user profile in Redis for future requests
        await redis.set(
            `user:${email}`,
            JSON.stringify(user),
            "EX", // Expiry time for cache
            2000 
        );

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
