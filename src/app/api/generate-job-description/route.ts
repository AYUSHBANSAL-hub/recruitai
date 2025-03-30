import { NextResponse } from "next/server"
import { getSession } from "../../../../lib/auth"
import { generateJobDescription } from "../../../../lib/formGenerator"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
    }

    // Parse request body
    const { jobDescription } = await request.json()

    if (!jobDescription ) {
      return NextResponse.json({ error: "Job description and hiring domain are required" }, { status: 400 })
    }

    // Generate fields using AI
    const jobDescriptionAI = await generateJobDescription(jobDescription)

    // Return the generated fields
    return NextResponse.json({ jobDescriptionAI }, { status: 200 })
  } catch (error) {
    console.error("Error generating fields:", error)
    return NextResponse.json({ error: "Failed to generate fields" }, { status: 500 })
  }
}

