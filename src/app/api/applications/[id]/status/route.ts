// src/app/api/applications/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendStatusUpdateEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    
    const application = await prisma.application.update({
      where: { id: params.id },
      data: { status },
      include: {
        candidate: true,
      },
    });

    // Send email notification
    if (['reviewed', 'shortlisted', 'rejected'].includes(status)) {
      await sendStatusUpdateEmail(
        application.candidate.email,
        application.candidate.name,
        status
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    );
  }
}