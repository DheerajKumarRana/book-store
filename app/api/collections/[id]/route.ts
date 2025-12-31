import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Collection from "@/models/Collection";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const collection = await Collection.findById(id);
        if (!collection) {
            return NextResponse.json({ message: "Collection not found" }, { status: 404 });
        }
        return NextResponse.json(collection);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching collection" }, { status: 500 });
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
        await dbConnect();

        const updatedCollection = await Collection.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCollection) {
            return NextResponse.json({ message: "Collection not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCollection);
    } catch (error: any) {
        return NextResponse.json({ message: "Error updating collection", error: error.message }, { status: 500 });
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

        const deletedCollection = await Collection.findByIdAndDelete(id);

        if (!deletedCollection) {
            return NextResponse.json({ message: "Collection not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Collection deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting collection" }, { status: 500 });
    }
}
