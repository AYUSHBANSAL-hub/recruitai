// /api/applications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { analyzeResumeWithGPT } from "../../../../lib/gpt";
import pdfParse from "pdf-parse";
import { analyzeResume } from "../../../../lib/deepseek";

const prisma = new PrismaClient();

// ✅ Utility Function: Fetch & Parse PDF Resume
async function fetchAndParseResume(resumeUrl: string): Promise<string> {
  try {
    console.log("🔄 Downloading resume from S3:", resumeUrl);

    const response = await fetch(resumeUrl);

    if (!response.ok) {
      throw new Error(`Failed to download resume. Status: ${response.status}`);
    }

    const resumeBuffer = await response.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(resumeBuffer));

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error("Parsed resume text is empty or unreadable.");
    }

    console.log("✅ Successfully extracted resume text.");
    return pdfData.text.trim();
  } catch (error) {
    console.error("❌ Error parsing PDF:", error);
    throw new Error("Resume parsing failed. Ensure the PDF is not corrupted.");
  }
}

// ✅ POST Handler: Submit Job Application
export async function POST(request: Request) {
  console.log("📥 Received POST request at /api/applications");

  try {
    const bodyText = await request.text();
    if (!bodyText) {
      console.error("❌ Request body is missing");
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    const body = JSON.parse(bodyText);
    const { formId, responses, resumeUrl } = body;

    if (!formId || !responses || !resumeUrl) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("📢 Fetching job form details for formId:", formId);

    // ✅ Fetch Job Description
    const form = await prisma.jobForm.findUnique({
      where: { id: formId },
      select: { jobDescription: true },
    });

    if (!form) {
      console.error("❌ Job form not found for formId:", formId);
      return NextResponse.json(
        { error: "Job form not found" },
        { status: 404 }
      );
    }

    // ✅ Store Application Before AI Processing
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

    // ✅ AI Analysis in Background
    (async () => {
      try {
        const resumeText = await fetchAndParseResume(resumeUrl);
        console.log("📄 Extracted Resume Text:", resumeText.slice(0, 500));

        console.log("🔍 Calling AI to analyze resume...");
        const analysis = await analyzeResume(resumeText, form.jobDescription);

        if (
          !analysis ||
          typeof analysis.matchScore !== "number" ||
          !analysis.reasoning
        ) {
          throw new Error("Invalid AI response format.");
        }

        console.log("✅ AI Analysis Successful:", analysis);

        // ✅ Update Application with AI match score & reasoning
        await prisma.application.update({
          where: { id: newApplication.id },
          data: {
            parsedResume: { text: resumeText },
            matchScore: analysis.matchScore,
            matchReasoning: analysis.reasoning,
          },
        });

        console.log("✅ AI Analysis Saved to DB");
      } catch (error) {
        console.error("❌ AI Processing Failed:", error);
      }
    })();

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ GET Handler: Fetch Applications for a Form
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId");

    console.log(
      "📢 Received GET request for applications with formId:",
      formId
    );

    let applications;

    if (formId) {
      console.log("📊 Fetching applications for specific form...");
      applications = await prisma.application.findMany({
        where: { formId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      console.log("📊 Fetching all applications...");
      applications = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    console.log("✅ Applications Retrieved:", applications.length);
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
