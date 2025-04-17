import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendStatusUpdateEmail } from "../../../../../../lib/email";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    if (!["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the application with candidate information
    const application = await prisma.application.update({
      where: { id: params.id },
      data: { status },
      include: {
        form: true,
      },
    });

    // Extract candidate name and email from responses
    const candidateName = application.responses["Full Name"] || application.responses["fixed-name"] || "Candidate";
    const candidateEmail = application.responses["Email Address"] || application.responses["fixed-email"];
    const jobTitle = application.form.title || "Position";

    // Format application date
    const applicationDate = new Date(application.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    // Generate calendar link for shortlisted candidates
    let calendarLink
    if (status === "SHORTLISTED") {
      // You can use cal.com or Calendly link here
      calendarLink = `https://cal.com/your-company/interview?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}&job=${encodeURIComponent(jobTitle)}`
    }

    // Send email notification based on status
    if (candidateEmail && ["REVIEWED", "SHORTLISTED", "REJECTED"].includes(status)) {
      await sendStatusUpdateEmail(
        candidateEmail,
        candidateName,
        status.toLowerCase(),
        jobTitle,
        applicationDate,
        calendarLink,
      )
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
