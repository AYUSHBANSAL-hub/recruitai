// src/app/api/forms/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { getSession } from '@/lib/auth';
import { getSession } from '../../../../lib/auth'; // Adjust path accordingly


const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      console.error('Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'ADMIN') {
      console.error(`Unauthorized: User role is ${session.role}`);
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { title, jobDescription, fields, hiringDomain } = await request.json();

    if (!title || !jobDescription || !fields.length || !hiringDomain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const form = await prisma.jobForm.create({
      data: {
        title,
        jobDescription,
        fields,
        userId: session.userId, // ✅ Ensure this is saved correctly
        active: true,
        hiringDomain,
      },
    });
    

    console.log('Form Created:', form);
    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession(); // ✅ Get the logged-in user session

    if (!session) {
      console.error("Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`Fetching forms for userId: ${session.userId}`);

    const forms = await prisma.jobForm.findMany({
      where: { userId: session.userId }, // ✅ Only return forms created by this user
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
