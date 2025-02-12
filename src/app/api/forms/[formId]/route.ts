import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params?: Record<string, string> }) {
  try {
    // ✅ Ensure params exist before accessing `formId`
    const formId = params?.formId;

    if (!formId) {
      console.error('Error: Missing formId in request');
      return NextResponse.json({ error: 'Missing formId' }, { status: 400 });
    }

    const form = await prisma.jobForm.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
