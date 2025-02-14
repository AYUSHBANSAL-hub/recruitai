// /api/applications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { analyzeResumeWithGPT } from "../../../../lib/gpt"; // ✅ Import GPT-3 function
import pdfParse from "pdf-parse";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 Incoming request body:", body);

    const { formId, responses, resumeUrl } = body;

    if (!formId || !responses || !resumeUrl) {
      console.error("❌ Missing required fields in request");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("📢 Creating new application for formId:", formId);

    const form = await prisma.jobForm.findUnique({
      where: { id: formId },
      select: { jobDescription: true },
    });

    if (!form) {
      console.error("❌ Job form not found for formId:", formId);
      return NextResponse.json({ error: "Job form not found" }, { status: 404 });
    }

    const newApplication = await prisma.application.create({
      data: {
        formId,
        userId: null, // Handle authentication properly in production
        responses,
        resumeUrl,
        parsedResume: null,
        matchScore: null,
        matchReasoning: null,
        status: "PENDING",
      },
    });

    console.log("✅ Application Created:", newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



// ✅ GET Handler: Fetch applications for a specific form
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId");

    console.log(
      "📢 Received GET request for applications with formId:",
      formId
    );

    if (!formId) {
      console.error("❌ Missing formId in request");
      return NextResponse.json({ error: "Missing formId" }, { status: 400 });
    }

    // ✅ Log all applications to debug
    const allApplications = await prisma.application.findMany();
    console.log("📊 Total Applications in DB:", allApplications.length);

    // Fetch applications from DB
    const applications = await prisma.application.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
    });

    console.log("✅ Applications Found for formId:", formId, applications);

    if (applications.length === 0) {
      console.warn("⚠️ No applications found for formId:", formId);
      return NextResponse.json([], { status: 200 }); // ✅ Return empty array instead of 404
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
