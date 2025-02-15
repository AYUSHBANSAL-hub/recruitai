// /api/applications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { analyzeResumeWithGPT } from "../../../../lib/gpt"; // ✅ Import GPT-3 function
import pdfParse from "pdf-parse";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log("📥 Received POST request at /api/applications");
  console.log("Request Method:", request.method);

  try {
    const bodyText = await request.text();
    console.log("📜 Raw Request Body:", bodyText);

    if (!bodyText) {
      console.error("❌ Request body is missing");
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    const body = JSON.parse(bodyText);
    console.log("📩 Parsed Request Body:", body);

    const { formId, responses, resumeUrl } = body;

    if (!formId || !responses || !resumeUrl) {
      console.error("❌ Missing required fields in request");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("📢 Fetching job form details for formId:", formId);

    // ✅ Step 1: Fetch Job Description
    const form = await prisma.jobForm.findUnique({
      where: { id: formId },
      select: { jobDescription: true },
    });

    if (!form) {
      console.error("❌ Job form not found for formId:", formId);
      return NextResponse.json({ error: "Job form not found" }, { status: 404 });
    }

    // ✅ Step 2: Store Application in Database Before AI Call
    const newApplication = await prisma.application.create({
      data: {
        formId,
        userId: null,
        responses,
        resumeUrl,
        parsedResume: null,
        matchScore: null,
        matchReasoning: null,
        status: "PENDING",
      },
    });

    console.log("✅ Application Created:", newApplication);

    // ✅ Step 3: Process AI in Background (No Blocking)
    (async () => {
      try {
        console.log("🔄 Downloading resume from S3:", resumeUrl);
        const response = await fetch(resumeUrl);
        if (!response.ok) throw new Error("Failed to download resume");

        const resumeBuffer = await response.arrayBuffer();
        // const resumeText = await pdfParse(Buffer.from(resumeBuffer)).then((data) => data.text);
        const resumeText = "TEST resume text";

        console.log("✅ Extracted Resume Text:", resumeText.slice(0, 500));

        console.log("🔍 Calling GPT-3 AI to analyze resume...");
        const analysis = await analyzeResumeWithGPT(resumeText, form.jobDescription);

        if (!analysis || typeof analysis.matchScore !== "number") {
          throw new Error("Invalid AI response format");
        }

        console.log("✅ GPT-3 AI Returned Analysis:", analysis);

        // ✅ Step 5: Update Application with AI match score & reasoning
        await prisma.application.update({
          where: { id: newApplication.id },
          data: {
            parsedResume: { text: resumeText },
            matchScore: analysis.matchScore,
            matchReasoning: analysis.reasoning,
          },
        });

        console.log("✅ GPT-3 Analysis Saved to DB");
      } catch (aiError) {
        console.error("❌ AI Processing Failed:", aiError);
      }
    })();

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

    console.log("📢 Received GET request for applications with formId:", formId);

    if (!formId) {
      console.error("❌ Missing formId in request");
      return NextResponse.json({ error: "Missing formId" }, { status: 400 });
    }

    console.log("📊 Fetching applications from DB...");
    const applications = await prisma.application.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
    });

    console.log("✅ Applications Found for formId:", formId, applications.length);

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
