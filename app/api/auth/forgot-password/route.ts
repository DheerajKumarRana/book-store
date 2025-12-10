import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendResetPasswordEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            // We return 200 even if user doesn't exist for security (avoid enumeration)
            // But for better UX in this specific app context, we might want to tell them
            return NextResponse.json(
                { message: "If an account exists, a reset link has been sent." },
                { status: 200 }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                { message: "This email is associated with a Google account. Please sign in with Google." },
                { status: 400 }
            );
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpires;
        await user.save();

        // Create Reset URL
        // Assuming localhost for dev, proper host for prod needs env
        const host = req.headers.get("host"); // e.g. localhost:3000
        const protocol = host?.includes("localhost") ? "http" : "https";
        const resetUrl = `${protocol}://${host}/reset-password?token=${resetToken}&email=${email}`;

        // Send Email
        await sendResetPasswordEmail(email, resetUrl);

        return NextResponse.json(
            { message: "Reset link sent to your email." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
