import { NextResponse } from "next/server";
import prisma from "../../../../lib/db/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, name, gender, bio, avatar, location } = body;

        if (!name || !gender || !bio || !avatar || !location) {
            return NextResponse.json(
                { error: "All the fields are required" },
                { status: 400 }
            );
        }

        const existingProfile = await prisma.profile.findFirst({
            where: { userId }, 
        });

        if (existingProfile) {
            return NextResponse.json(
                { error: "User already has a profile" },
                { status: 400 }
            );
        }

        const newProfile = await prisma.profile.create({
            data: {
                userId,
                name,
                gender,
                bio, 
                avatar,
                location,
            },
        });

        return NextResponse.json(newProfile, { status: 201 });
    } catch (error) {
        console.error("Error while creating profile:", error);

        return NextResponse.json(
            { error: "Failed to create profile" },
            { status: 500 }
        );
    }
}
