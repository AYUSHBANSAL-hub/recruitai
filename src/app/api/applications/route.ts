// /api/applications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { analyzeResumeWithGPT } from "../../../../lib/gpt"; // ✅ Import GPT-3 function
import { fetchAndParseResume } from "../../../../lib/resumeParsing";
import { analyzeResumeWithGemini } from "../../../../lib/openRouter";
import { sendApplicationSubmittedEmail } from "../../../../lib/email";

const prisma = new PrismaClient();

// ✅ Utility Function: Fetch Job Description
async function getJobDescription(formId: string) {
  const form = await prisma.jobForm.findUnique({
    where: { id: formId },
    select: { jobDescription: true },
  });

  if (!form) throw new Error("Job form not found");
  return form.jobDescription;
}

// ✅ Utility Function: Store Application Before AI Call
async function storeApplication(formId: string, responses: any, resumeUrl: string) {
  return await prisma.application.create({
    data: {
      formId,
      userId: null,
      responses,
      resumeUrl,
      parsedResume: undefined,
      matchScore: null,
      matchReasoning: null,
      status: "PENDING",
      strengths:[],
      weaknesses:[]
    },
  });
}

// ✅ Utility Function: Process Resume AI Analysis
async function processResumeAI(applicationId: string, resumeUrl: string, jobDescription: string) {
  try {
    console.log("📥 Fetching resume for AI analysis:", resumeUrl);

    // ✅ Fetch & Parse Resume Text
    const resumeText = await fetchAndParseResume(resumeUrl);
    // console.log("✅ Extracted Resume Text:", resumeText.substring(0, 500));

    console.log("🔍 Calling AI to analyze resume...");
    const analysis = await analyzeResumeWithGemini(resumeText, jobDescription);
    // Simulating AI response (for debugging)
    // const analysis = { matchScore: 85, reasoning: "Good alignment with job requirements" };

    console.log("✅ AI Analysis Successful:", analysis);
    // ✅ Update Application with AI match score & reasoning
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        parsedResume: { text: resumeText },
        matchScore: analysis.matchScore,
        matchReasoning: analysis.reasoning,
        strengths : analysis.strengths,
        weaknesses : analysis.weaknesses,
      },
    });

    console.log("✅ AI Analysis Saved to DB");
  } catch (error) {
    console.error("❌ AI Processing Failed:", error);
  }
}

// ✅ API Route: Handle Application Submission
export async function POST(request: Request) {
  console.log("📥 Received POST request at /api/applications");

  try {
    const body = await request.json(); // Auto JSON parsing
    const { formId, responses, resumeUrl, formTitle } = body;

    if (!formId || !responses || !resumeUrl || !formTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // console.log("📢 Fetching job description for formId:", formId);
    // const jobDescription = await getJobDescription(formId);

    // console.log("📂 Storing application...");
    // const newApplication = await storeApplication(formId, responses, resumeUrl);
    // console.log("✅ Application Created:", newApplication);

    // ✅ AI Processing in Background
    fetch(process.env.LAMBDA_TRIGGER_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formId, responses, resumeUrl }),
    });
    await sendApplicationSubmittedEmail(responses["fixed-email"], responses["fixed-name"], formTitle);

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}


// ✅ GET Handler: Fetch applications for a specific form
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId");

    console.log("📢 Received GET request for applications with formId:", formId);

    let applications;

    if (formId) {
      console.log("📊 Fetching applications for specific form...");
      applications = await prisma.application.findMany({
        where: { formId },
        orderBy: { createdAt: "desc" },
        include: {
          form: true, // Fetch job details along with applications
        },
      });
    } else {
      console.log("📊 Fetching all applications...");
      applications = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          form: true, // Fetch job details for all applications
        },
      });
    }

    console.log("✅ Applications Retrieved:", applications);
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

