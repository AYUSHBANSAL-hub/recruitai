// src/app/api/upload-url/route.ts
import { NextResponse } from 'next/server';
import { generateUploadUrl } from '@/lib/s3';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileType } = await request.json();
    const uploadUrl = await generateUploadUrl(fileType);
    const fileUrl = uploadUrl.split('?')[0]; // Base S3 URL without presigned params

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
