import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || (() => {
                console.error("❌ [Google Auth] Missing GOOGLE_CLIENT_ID in .env.local");
                return "";
            })(),
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || (() => {
                console.error("❌ [Google Auth] Missing GOOGLE_CLIENT_SECRET in .env.local");
                return "";
            })(),
        }),
        CredentialsProvider({
            name: "Credentials",
            // ... existing credentials provider ...
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                const user = await User.findOne({ email: credentials?.email });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (!user.password) {
                    throw new Error("Please login with your social account");
                }

                const isValid = await bcrypt.compare(
                    credentials?.password || "",
                    user.password
                );

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account.provider === "google") {
                try {
                    await dbConnect();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: 'user',
                            isVerified: true, // Google emails are verified
                            password: '', // No password for OAuth users
                        });
                        await newUser.save();
                        return true;
                    }
                    return true;
                } catch (error) {
                    console.error("Error signing in with Google", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }: any) {
            if (account && user) {
                // On first sign in, user object is available
                // If it's a google login, we might need to fetch the mongo ID if we just created them
                if (account.provider === 'google') {
                    await dbConnect();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = dbUser.role;
                    }
                } else {
                    token.role = user.role;
                    token.id = user.id;
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
