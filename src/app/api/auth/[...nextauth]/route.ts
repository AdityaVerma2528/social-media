import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"; 
import prisma from "../../../../../lib/db/prisma";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "", 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "", 
        })
    ],
    callbacks: {
        async signIn(params) {
            if (!params.user || !params.user.email) {
                console.log("Invalid user payload:", params);
                return false; 
            }
            
            try {
                await prisma.user.create({
                    data: {
                        email: params.user.email, 
                        name: params.user.name ?? ""
                    }
                });
            } catch (e) {
                console.error("Error creating user:", e);
            }
            
            return true; 
        }
    }
});

export { handler as GET, handler as POST };
