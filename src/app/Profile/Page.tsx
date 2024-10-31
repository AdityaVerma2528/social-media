"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeChanger from "@/components/ThemeChanger";
import Navbar from "@/components/Navbar";
import { MdLocationPin } from "react-icons/md";
import Link from "next/link";

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
}

export default function Page() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [webUser, setWebUser] = useState<WebUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        const fetchUserCredentials = async (email: string) => {
            try {
                const response = await fetch(
                    `/api/getUserForProfile/${email}`,
                    {
                        method: "GET",
                    }
                );

                if (!response.ok) {
                    setWebUser(null);
                    return;
                }

                const userCredentials: WebUser = await response.json();
                setWebUser(userCredentials);

            } catch (error) {
                console.error("Error fetching user", error);
                setWebUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserCredentials(userEmail);
    }, [userEmail]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            {webUser ? (
                <>
                    <div className="flex gap-40 justify-center items-center mt-28">
                        {webUser.profiles.map((profile) => (
                            <div key={profile.id} className="flex flex-col items-center justify-center gap-8 font-bold">
                                <div>
                                    <img
                                        className="w-52 h-52 rounded-full object-cover"
                                        src={profile.avatar}
                                        alt="avatar"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex flex-col gap-10">
                            <div className="flex gap-8 items-center justify-center">
                                <div className="text-2xl">{webUser.email}</div>
                                <Button variant="outline">Edit profile</Button>
                                <ThemeChanger />
                            </div>
                            <div className="flex text-2xl gap-16">
                                {webUser.profiles.map((profile) => (
                                    <div key={profile.id}>{profile.posts.length} Post</div>
                                ))}
                                <Link href={"/followers"}>
                                    {webUser.profiles.map((profile) => (
                                        <div key={profile.id}>{profile.followers.length} Follower</div>
                                    ))}
                                </Link>
                                <Link href={"/following"}>
                                    {webUser.profiles.map((profile) => (
                                        <div key={profile.id}>{profile.following.length} Following</div>
                                    ))}
                                </Link>
                            </div>
                            <div className="font-bold max-w-64">
                                {webUser.profiles.map((profile) => (
                                    <div key={profile.id} className="flex gap-3">
                                        <div>{profile.bio}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 max-w-screen-lg h-1 ml-60 mt-28 text-black">
                        .
                    </div>

                    <div className="flex items-center justify-center p-5 text-xl">
                        Posts
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-screen-lg p-4">
                        {webUser.profiles.map((profile) =>
                            profile.posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="border rounded-lg overflow-hidden shadow-md bg-gray-900"
                                >
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-white">
                                            {post.title}
                                        </h3>
                                        <p className="text-white flex items-center gap-2">
                                            <MdLocationPin />
                                            {post.location}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div>User not found.</div>
            )}
        </>
    );
}
