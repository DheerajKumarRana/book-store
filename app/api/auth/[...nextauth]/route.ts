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
                try {
                    console.log("[NextAuth] Authorize called for:", credentials?.email);
                    if (!process.env.NEXTAUTH_SECRET) {
                        console.warn("[NextAuth] WARNING: NEXTAUTH_SECRET is MISSING in env!");
                    }

                    await dbConnect();

                    const user = await User.findOne({ email: credentials?.email });

                    if (!user) {
                        console.log("[NextAuth] User not found");
                        throw new Error("No user found with this email");
                    }

                    if (!user.password) {
                        console.log("[NextAuth] User has no password (social login?)");
                        throw new Error("Please login with your social account");
                    }

                    const isValid = await bcrypt.compare(
                        credentials?.password || "",
                        user.password
                    );

                    if (!isValid) {
                        console.log("[NextAuth] Invalid password");
                        throw new Error("Invalid password");
                    }

                    console.log("[NextAuth] Login successful for:", user.email);
                    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
                } catch (error: any) {
                    console.error("[NextAuth] Authorize Error:", error);
                    throw new Error(error.message || "Internal Server Error");
                }
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
    // Fallback to avoid "ikm" error in dev if env var is missing
    secret: process.env.NEXTAUTH_SECRET || "temporary_dev_secret_do_not_use_in_prod",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
