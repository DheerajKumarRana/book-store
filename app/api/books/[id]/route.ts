import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Book from "@/models/Book";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const book = await Book.findById(id);
        if (!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }
        return NextResponse.json(book);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching book" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        console.log("UPDATE BOOK PAYLOAD:", JSON.stringify(body, null, 2));
        await dbConnect();

        const updatedBook = await Book.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedBook) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        return NextResponse.json(updatedBook);
    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Error updating book", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Book deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting book" }, { status: 500 });
    }
}
