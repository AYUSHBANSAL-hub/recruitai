import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { formId: string } }) {
  try {
    const { active } = await request.json();
    console.log(active)

    const application = await prisma.jobForm.update({
      where: { id: params.formId },
      data: { active },
    });

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
