
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // @ts-ignore
    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { address, phone, name } = await req.json();

    await dbConnect();

    // @ts-ignore
    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        session.user.id,
        { address, phone, name },
        { new: true }
    ).select("-password");

    return NextResponse.json({ user, message: "Profile updated successfully" });
}
