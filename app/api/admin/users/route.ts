export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

        const body = await req.json();
        const { isBlocked } = body;

        await dbConnect();
        const user = await User.findById(id);

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        user.isBlocked = isBlocked;
        await user.save();

        return NextResponse.json({ message: "User updated", user: { id: user._id, isBlocked: user.isBlocked } });

    } catch (error: any) {
        return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
    }
}
