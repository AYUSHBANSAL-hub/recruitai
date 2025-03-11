import { NextResponse } from "next/server";
import { generateUploadUrl } from "../../../../lib/s3";

export async function POST(request: Request) {
  try {
    const { fileType } = await request.json();
    if (!fileType || typeof fileType !== "string") {
      return NextResponse.json({ error: "Missing or invalid file type" }, { status: 400 });
    }

    console.log("Generating upload URL for file type:", fileType);

    const { uploadUrl, fileUrl } = await generateUploadUrl(fileType);

    return NextResponse.json({ uploadUrl, fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
