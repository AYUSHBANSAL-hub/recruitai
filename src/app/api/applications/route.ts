// /api/applications/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ GET Handler: Fetch applications for a specific form
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    let applications;

    if (formId) {
      // ✅ Fetch applications for a specific form
      applications = await prisma.application.findMany({
        where: { formId },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // ✅ Fetch all applications if no formId is provided
      applications = await prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ✅ POST Handler: Submit a new application
export async function POST(request: Request) {
  try {
    const { formId, responses, resumeUrl } = await request.json();

    if (!formId || !responses || !resumeUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newApplication = await prisma.application.create({
      data: {
        formId,
        userId: null, // Replace with actual user authentication if needed
        responses,
        resumeUrl,
        status: 'PENDING',
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
