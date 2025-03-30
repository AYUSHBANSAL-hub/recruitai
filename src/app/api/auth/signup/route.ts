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

    // Validation (basic)
    if (!email || !password || !firstName || !lastName || !companyName || !industry || !companySize || !jobTitle || !department || !acceptTerms) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if a company already exists with the same name and website
    let company = await prisma.company.findFirst({
      where: {
        name: companyName,
        website: companyWebsite || undefined,
      },
    })

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          website: companyWebsite || undefined,
          industry,
          size: companySize,
        },
      })
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",

        // Personal
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        phoneNumber: phoneNumber || null,

        // Company (embedded for now)
        companyName,
        companyWebsite: companyWebsite || null,
        industry,
        companySize,
        companyId: company.id,

        // Role Info
        jobTitle,
        department,

        recruitmentChallenges: recruitmentChallenges?.length ? recruitmentChallenges : [],
        acceptedTerms: true,
      },
    })

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}