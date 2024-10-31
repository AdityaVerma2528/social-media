"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

interface WebUser {
    id: string;
    email: string;
    name: string;
}

export default function Page() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const [WebUser, setWebUser] = useState<WebUser | null>(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const [location, setLocation] = useState("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            const userId = WebUser?.id;

            const response = await fetch("../api/buildProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    name,
                    gender,
                    bio,
                    avatar,
                    location,
                }),
            });

            if (response.ok) {
                setSuccess("Profile sucessfully created");
            } else {
                setError("Failed to create profile");
            }
        } catch (error) {
            console.log(error);
            setError("Someting went wrong");
        }
    };

    return (
        <>
            <div>
                <Link href={"../box"}>
                    click me 
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center text-white">
                <div className="p-10 text-3xl font-bold">
                    Enter Profile Credentials
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center justify-center text-black">
                        <input
                            type="text"
                            value={name}
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                            className="mb-5 p-4 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            value={gender}
                            placeholder="Enter your gender"
                            onChange={(e) => setGender(e.target.value)}
                            className="mb-5 p-4 rounded-lg text-white"
                        />
                        <textarea
                            value={bio}
                            placeholder="Enter your bio"
                            onChange={(e) => setBio(e.target.value)}
                            className="mb-5 p-4 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            value={avatar}
                            placeholder="Enter your image"
                            onChange={(e) => setAvatar(e.target.value)}
                            className="mb-5 p-4 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            value={location}
                            placeholder="Enter your location"
                            onChange={(e) => setLocation(e.target.value)}
                            className="mb-5 p-4 rounded-lg text-white"
                        />
                        <Button
                            type="submit"
                            variant={"outline"}
                            className="text-white"
                        >
                            Build Profile
                        </Button>
                    </div>
                </form>
                {success && <div className="mt-5 text-green-500">{success}</div>}
                {error && <div className="mt-5 text-red-500">{error}</div>}
            </div>

        </>
    );
}
