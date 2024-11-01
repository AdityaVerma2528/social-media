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
        async signIn({ user }) {
            if (!user || !user.email) {
                console.log("Invalid user payload:", user);
                return false; 
            }
        
            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email }, 
                }
                                                                  
                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email, 
                            name: user.name ?? ""
                        }
                    });
                }
            } catch (e) {
                console.error("Error creating user:", e);
            }
            
            return true; 
        }
    }
});

export { handler as GET, handler as POST };
