import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken: otp,
            verificationTokenExpiry: otpExpiry,
            isVerified: false
        });

        // Send Email
        const emailSent = await sendVerificationEmail(email, otp);
        if (!emailSent) {
            console.error("❌ [Register] Failed to send verification email to:", email);
        } else {
            console.log("✅ [Register] Verification email sent successfully to:", email);
        }

        return NextResponse.json(
            { message: "User created successfully. Please verify email.", email: user.email },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
