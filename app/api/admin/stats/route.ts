export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Book from "@/models/Book";
import Collection from "@/models/Collection";

export async function GET() {
    try {
        await dbConnect();

        const [totalBooks, totalUsers, totalCollections] = await Promise.all([
            Book.countDocuments(),
            User.countDocuments(),
            Collection.countDocuments(),
        ]);

        return NextResponse.json({
            totalBooks,
            totalUsers,
            totalCollections,
        });

    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching stats", error: error.message }, { status: 500 });
    }
}
