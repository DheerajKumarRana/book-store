import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string,
    folder: string
): Promise<{ url: string; key: string }> {
    const key = `${folder}/${Date.now()}_${fileName.replace(/\s+/g, "_")}`;

    // Note regarding Public Access:
    // This implementation relies on the bucket having a policy that allows public read access 
    // to 'covers/' and 'previews/' folders, OR passing a public-read ACL if enabled.
    // For 'full_books/' it should remain private.
    // The key structure ensures we know where it lives.

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
        // ACL: folder !== 'full_books' ? 'public-read' : 'private', 
    });

    await s3Client.send(command);

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { url, key };
}


export async function getPresignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn });
}

export async function getPresignedUrlFromUrl(fullUrl: string) {
    if (!fullUrl || !fullUrl.includes(process.env.AWS_S3_BUCKET_NAME!)) return fullUrl;

    try {
        const urlObj = new URL(fullUrl);
        // Pathname includes the leading slash, so we remove it to get the Key
        const key = decodeURIComponent(urlObj.pathname.substring(1));
        return await getPresignedUrl(key);
    } catch (e) {
        console.error("Error signing URL:", fullUrl, e);
        return fullUrl;
    }
}
