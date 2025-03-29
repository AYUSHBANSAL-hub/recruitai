import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      companyName,
      companyWebsite,
      industry,
      companySize,
      jobTitle,
      department,
      recruitmentChallenges,
      acceptTerms,
    } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user with all the additional information
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN", // Ensure users sign up with this role

        // Personal information
        firstName: firstName || null,
        lastName: lastName || null,
        name: firstName && lastName ? `${firstName} ${lastName}` : null, // Set name for backward compatibility
        phoneNumber: phoneNumber || null,

        // Company information
        companyName: companyName || null,
        companyWebsite: companyWebsite || null,
        industry: industry || null,
        companySize: companySize || null,

        // Role information
        jobTitle: jobTitle || null,
        department: department || null,

        // Recruitment challenges
        recruitmentChallenges: recruitmentChallenges ? JSON.stringify(recruitmentChallenges) : null,

        // Terms acceptance
        acceptedTerms: acceptTerms || false,
      },
    })

    return NextResponse.json({ message: "User created successfully", userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}