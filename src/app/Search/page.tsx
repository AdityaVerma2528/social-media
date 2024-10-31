"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ThemeChanger from "@/components/ThemeChanger";
import { useSession } from "next-auth/react";
import { MdLocationPin } from "react-icons/md";

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

    const [searchedUserEmail, setSearchedUserEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(false);

    const [webUser, setWebUser] = useState<WebUser | null>(null);
    const [searchedUser, setSearchedUser] = useState<WebUser | null>(null);

    const [followerId, setFollowerId] = useState("");
    const [followingId, setFollowingId] = useState("");
    const [followingAvatar, setFollowingAvatar] = useState("");
    const [followingEmail, setFollowingEmail] = useState("");

    const handleSearch = () => {
        setSearchTriggered(true);
        setLoading(true);
    };

    const fetchFollowerUserCredentials = async (email: string) => {
        try {
            const response = await fetch(`/api/getUserForProfile/${email}`, {
                method: "GET",
            });

            if (!response.ok) {
                setWebUser(null);
                return;
            }

            const userCredentials: WebUser = await response.json();
            setWebUser(userCredentials);

            if (userCredentials.profiles.length > 0) {
                setFollowerId(userCredentials.profiles[0].id);
            }
        } catch (error) {
            console.error("Error fetching user", error);
            setWebUser(null);
        }
    };

    const fetchFollowingUserCredentials = async (email: string) => {
        try {
            const response = await fetch(`/api/getUserForProfile/${email}`, {
                method: "GET",
            });

            if (!response.ok) {
                setSearchedUser(null);
                return;
            }

            const userCredentials: WebUser = await response.json();
            setSearchedUser(userCredentials);

            if (userCredentials.profiles.length > 0) {
                setFollowingId(userCredentials.profiles[0].id);
                setFollowingAvatar(userCredentials.profiles[0].avatar);
                setFollowingEmail(userCredentials.email);
            }

        } catch (error) {
            console.error("Error fetching user", error);
            setSearchedUser(null);
        } finally {
            setLoading(false);
            setSearchTriggered(false);
        }
    };

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        fetchFollowerUserCredentials(userEmail);
    }, [userEmail]);

    useEffect(() => {
        if (searchTriggered) {
            fetchFollowingUserCredentials(searchedUserEmail);
        }
    }, [searchTriggered]);

    const submitFollowerAndFollowing = async () => {
        try {
            const response = await fetch("../api/setFollower", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    followerId,
                    followingId,
                    followingAvatar,
                    followingEmail,
                }),
            });

            if (response.ok) {
                console.log("request successful");
            } else {
                console.log("request not successful");
            }
        } catch (error) {
            console.log("An Error Happened : ", error);
        }
    };

    return (
        <div>
            {!searchedUser && (
                <>
                    <div className="flex items-center justify-center p-10 text-3xl font-bold">
                        Search By Email
                    </div>
                    <div>
                        <form
                            action=""
                            className="flex flex-col items-center justify-center"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Enter email"
                                className="rounded-lg mb-5 p-5"
                                value={searchedUserEmail}
                                onChange={(e) =>
                                    setSearchedUserEmail(e.target.value)
                                }
                            />
                            <Button
                                type="submit"
                                variant={"outline"}
                                className="w-20"
                            >
                                Search
                            </Button>
                        </form>
                    </div>
                </>
            )}

            {loading ? (
                <div>Loading...</div>
            ) : searchedUser ? (
                <>
                    <div className="flex gap-40 justify-center items-center mt-28">
                        {searchedUser.profiles.map((profile) => (
                            <div
                                className="flex flex-col items-center justify-center gap-8 font-bold"
                                key={profile.id}
                            >
                                <img
                                    className="w-52 h-52 rounded-full object-cover"
                                    src={profile.avatar}
                                    alt="avatar"
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-10">
                            <div className="flex gap-8 items-center justify-center">
                                <div className="text-2xl">
                                    {searchedUser.email}
                                </div>
                                <Button variant="outline">Edit profile</Button>
                                <ThemeChanger />
                            </div>
                            <div className="flex text-2xl gap-16">
                                {searchedUser.profiles.map((profile, index) => (
                                    <div key={`posts-${index}`}>
                                        {profile.posts.length} Post
                                    </div>
                                ))}
                                {searchedUser.profiles.map((profile, index) => (
                                    <div key={`followers-${index}`}>
                                        {profile.followers.length} Follower
                                    </div>
                                ))}
                                {searchedUser.profiles.map((profile, index) => (
                                    <div key={`following-${index}`}>
                                        {profile.following.length} Following
                                    </div>
                                ))}
                            </div>
                            <div className="font-bold max-w-64">
                                {searchedUser.profiles.map((profile) => (
                                    <div
                                        className="flex gap-3"
                                        key={profile.id}
                                    >
                                        <div>{profile.bio}</div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant={"outline"}
                                className="bg-blue-700 text-white"
                                onClick={submitFollowerAndFollowing}
                            >
                                Follow
                            </Button>
                        </div>
                    </div>

                    <div className="bg-gray-800 max-w-screen-lg h-1 ml-60 mt-28 text-black">
                        .
                    </div>

                    <div className="flex items-center justify-center p-5 text-xl">
                        Posts
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-screen-lg p-4">
                        {searchedUser.profiles.flatMap((profile) =>
                            profile.posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="border rounded-lg overflow-hidden shadow-md bg-gray-900"
                                >
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-48"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-white">
                                            {post.title}
                                        </h3>
                                        <p className="text-white flex items-center gap-3">
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
                <div></div>
            )}
        </div>
    );
}
