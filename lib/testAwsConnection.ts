require("dotenv").config(); // ✅ Load .env file

const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

console.log("🔍 AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("🔍 AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "Exists" : "Not Found");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3Access() {
  try {
    console.log("🔍 Testing AWS S3 Connection...");
    const response = await s3Client.send(new ListBucketsCommand({}));
    console.log("✅ AWS Connection Successful! Available Buckets:", response.Buckets);
  } catch (error) {
    console.error("❌ AWS Credentials Error:", error);
  }
}

testS3Access();