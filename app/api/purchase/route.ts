import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { bookId } = await req.json();
        await dbConnect();

        const user = await User.findOne({ email: session.user?.email });

        if (user.purchasedBooks.includes(bookId)) {
            return NextResponse.json({ message: "Already purchased" }, { status: 400 });
        }

        user.purchasedBooks.push(bookId);
        await user.save();

        return NextResponse.json({ message: "Purchase successful" });
    } catch (error) {
        return NextResponse.json({ message: "Error processing purchase" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ purchased: false });
        }

        const { searchParams } = new URL(req.url);
        const bookId = searchParams.get('bookId');

        if (!bookId) {
            return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user?.email });

        const isPurchased = user.purchasedBooks.includes(bookId);

        return NextResponse.json({ purchased: isPurchased });
    } catch (error) {
        return NextResponse.json({ message: "Error checking status" }, { status: 500 });
    }
}
