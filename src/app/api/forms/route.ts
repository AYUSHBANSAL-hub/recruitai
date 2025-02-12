// src/app/api/forms/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, jobDescription, fields } = await request.json();

    const form = await prisma.jobForm.create({
      data: {
        title,
        jobDescription,
        fields,
        userId: session.userId,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const forms = await prisma.jobForm.findMany({
      where: session.role === 'ADMIN' ? { userId: session.userId } : { active: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}