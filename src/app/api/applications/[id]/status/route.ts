import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    
    if (!['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
