import { NextResponse } from "next/server"
import { generateFieldsFromJD } from "../../../../lib/formGenerator"
import { getSession } from "../../../../lib/auth"

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
    const { jobDescription, hiringDomain } = await request.json()

    if (!jobDescription || !hiringDomain) {
      return NextResponse.json({ error: "Job description and hiring domain are required" }, { status: 400 })
    }

    // Generate fields using AI
    const fields = await generateFieldsFromJD(jobDescription, hiringDomain)

    // Return the generated fields
    return NextResponse.json({ fields }, { status: 200 })
  } catch (error) {
    console.error("Error generating fields:", error)
    return NextResponse.json({ error: "Failed to generate fields" }, { status: 500 })
  }
}

