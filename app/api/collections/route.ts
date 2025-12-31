export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Collection from "@/models/Collection";
import Book from "@/models/Book";

export async function GET() {
    try {
        await dbConnect();
        const collections = await Collection.find({}).sort({ createdAt: -1 });

        // Enrich with book count if needed, but for list view, maybe keep it simple?
        // Let's do a quick count aggregation if performance allows, or just return pure collections.
        // For professional feel, seeing "12 items" is nice.

        const enhancedCollections = await Promise.all(collections.map(async (col) => {
            // Rule is a tag string. Count books that have this tag.
            const count = await Book.countDocuments({ tags: col.rule });
            return { ...col.toObject(), bookCount: count };
        }));

        return NextResponse.json(enhancedCollections);
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching collections", error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await dbConnect();

        const collection = await Collection.create(body);
        return NextResponse.json(collection, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error creating collection", error: error.message }, { status: 500 });
    }
}
