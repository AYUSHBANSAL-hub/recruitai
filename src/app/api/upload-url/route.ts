// src/app/api/upload-url/route.ts
import { NextResponse } from "next/server";
import { generateUploadUrl } from "../../../../lib/s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object") {
      return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
    }

    const fileType = file.type;
    console.log("Generating upload URL for file type:", fileType);

    const { uploadUrl, fileUrl } = await generateUploadUrl(fileType);

    return NextResponse.json({ uploadUrl, fileUrl }, { status: 200 }); // ✅ Return both URLs
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
