// src/lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateUploadUrl(fileType: string): Promise<{ uploadUrl: string, fileUrl: string }> {
  const fileKey = `${uuidv4()}-${Date.now()}.${fileType.split("/")[1]}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    ContentType: fileType,
    ACL: "public-read", // ✅ Allow public access to the uploaded file
  });

  // ✅ Generate a pre-signed URL for uploading
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  // ✅ Construct the publicly accessible file URL
  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  return { uploadUrl, fileUrl };
}
