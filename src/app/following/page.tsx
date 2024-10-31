"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface WebUser {
    id: string;
    email: string;
    name: string;
    profiles: Profile[];
}

interface Profile {
    id: string;
    userId: string;
    name: string;
    gender: string;
    bio: string;
    avatar: string;
    location: string;
    posts: Post[];
    following: Follows[];
    followers: Follows[];
    createdAt: Date;
    updatedAt: Date;
}

interface Post {
    id: string;
    title: string;
    imageUrl: string;
    location: string;
    profileId: string;
}

interface Follows {
    id: string;
    followerId: string;
    followingId: string;
    followingAvatar: string;
    followingEmail: string;
}

export default function Page() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [webUser, setWebUser] = useState<WebUser>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        const fetchUserCredentials = async (email: string) => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/getUserForProfile/${email}`,
                    { method: "GET" }
                );

                if (!response.ok) {
                    console.log("The response was not ok");
                    return;
                }

                const userCredentials: WebUser = await response.json();
                setWebUser(userCredentials);
            } catch (error) {
                console.error("Error fetching user", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserCredentials(userEmail);
    }, [userEmail]);

    useEffect(() => {
        console.log("Updated webUser:", webUser); // Log changes to webUser
    }, [webUser]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {webUser ? (
                <>
                    <div className="flex items-center justify-center mt-7 text-3xl font-bold">
                        Followers
                    </div>
                    {webUser.profiles.map((profile) => (
                        <div key={profile.id}>
                            {profile.following.length > 0 ? (
                                profile.following.map((following) => (
                                    <div key={following.id} className="flex items-center justify-center gap-5 mt-9">
                                        <img
                                            src={following.followingAvatar}
                                            alt="img"
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                        {following.followingEmail}
                                    </div>
                                ))
                            ) : (
                                <p>No followers yet.</p>
                            )}.
                        </div>
                    ))}
                </>
            ) : (
                <div>User not found.</div>
            )}
        </div>
    );
}
