import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // 'cover', 'preview', 'full'

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        let folder = "others";
        if (type === "cover") folder = "Cover Images";
        else if (type === "preview") folder = "Preview Files";
        else if (type === "full") folder = "Full Books";
        else {
            return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const { url, key } = await uploadToS3(buffer, file.name, file.type, folder);

        return NextResponse.json({
            message: "Success",
            url,
            key
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Failed to upload file."
        }, { status: 500 });
    }
}
