// src/app/api/upload-url/route.ts
import { NextResponse } from 'next/server';
import { generateUploadUrl } from '../../../../lib/s3';
import { getSession } from '../../../../lib/auth';


export async function POST(request: Request) {
  try {
    const formData = await request.formData(); // ✅ Get form data instead of JSON
    const file = formData.get('file'); // ✅ Get the uploaded file

    if (!file || typeof file !== 'object') {
      return NextResponse.json({ error: 'Invalid file upload' }, { status: 400 });
    }

    const fileType = file.type; // ✅ Get MIME type (e.g., "application/pdf")

    console.log("Generating upload URL for file type:", fileType);

    const uploadUrl = await generateUploadUrl(fileType);
    const fileUrl = uploadUrl.split('?')[0]; // Remove presigned params from the URL

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}