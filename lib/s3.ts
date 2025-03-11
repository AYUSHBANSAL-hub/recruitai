import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// ✅ Ensure AWS credentials exist before initializing the client
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.AWS_BUCKET_NAME) {
  throw new Error("❌ AWS credentials are missing. Check your environment variables.");
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export async function generateUploadUrl(
  fileType: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const fileExtension = fileType?.split("/")[1] || "bin"; // Fallback to 'bin' if fileType is missing
  const fileKey = `${uuidv4()}-${Date.now()}.${fileExtension}`;

  console.log("🚀 Uploading to Bucket:", process.env.AWS_BUCKET_NAME); // ✅ Log bucket name

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    ContentType: fileType,
    ACL: "public-read"
    // ACL: "bucket-owner-full-control", // ✅ Ensure bucket owner has control
    // Metadata: {
    //     "x-amz-meta-content-type": fileType || "application/octet-stream",
    // },
});


  // ✅ Generate a presigned upload URL
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  // ✅ Ensure URL encoding for the file path
  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(fileKey)}`;

  console.log("✅ Upload URL:", uploadUrl);
  console.log("📂 Expected File URL:", fileUrl);

  return { uploadUrl, fileUrl };
}