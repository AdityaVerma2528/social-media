"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    createdAt: Date;
    updatedAt: Date;
}

export default function Page() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [profileId, setProfileId] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

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
    }, [userEmail]); // Added userEmail as a dependency

    const setTheProfileId = () => {
        if (webUser && webUser.profiles.length > 0) {
            setProfileId(webUser.profiles[0].id);
        }
    };

    useEffect(() => {
        setTheProfileId();
    }, [webUser]);

    if (loading) return <div>Loading...</div>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("../api/uploadFile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ profileId, imageUrl, title, location }),
            });

            if (response.ok) {
                setSuccess("Post Created sucessfully");
            } else {
                setError("Failed to take post");
            }
        } catch (error) {
            setError("Something went wrong");
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center"
            >
                <div className="text-3xl font-bold p-10">Create Post</div>
                <input
                    type="text"
                    value={imageUrl}
                    placeholder="Enter your url of the image"
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mb-5 rounded-lg p-5"
                />
                <input
                    type="text"
                    value={title}
                    placeholder="Enter the title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-5 rounded-lg p-5"
                />
                <input
                    type="text"
                    value={location}
                    placeholder="Enter your location"
                    onChange={(e) => setLocation(e.target.value)}
                    className="mb-5 rounded-lg p-5"
                />
                <Button variant={"outline"} type="submit">
                    Submit
                </Button>
            </form>
            {success && <div className="mt-5 text-green-500">{success}</div>}
            {error && <div className="mt-5 text-red-500">{error}</div>}
        </div>
    );
}
