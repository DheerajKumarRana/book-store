import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Book from "@/models/Book";

const dummyBooks = [
    {
        title: "The Silent Ocean",
        coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        preview: "Know your enemy...",
        genre: "History",
        views: 1100,
        sold: 50
    },
    {
        title: "Lost in Translation",
        author: "Sofia C.",
        description: "A story about cultural differences.",
        price: 10.00,
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        preview: "She looked at him...",
        genre: "Romance",
        views: 1200,
        sold: 150
    }
];

export async function GET() {
    try {
        await dbConnect();
        await Book.deleteMany({}); // Clear existing books to avoid duplicates
        await Book.insertMany(dummyBooks);
        return NextResponse.json({ message: "Seeded 10 dummy books successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
    }
}
