import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "User already verified" }, { status: 200 });
        }

        if (user.verificationToken !== otp) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        if (user.verificationTokenExpiry < new Date()) {
            return NextResponse.json({ message: "OTP expired" }, { status: 400 });
        }

        // Verify user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
