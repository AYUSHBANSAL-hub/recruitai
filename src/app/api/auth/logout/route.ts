import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (token) {
      // Create a response with the cookie removal
      const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
      );

      // Remove the auth-token cookie
      response.cookies.delete("auth-token");

      return response;
    }

    return NextResponse.json(
      { message: "Already logged out" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Error during logout" },
      { status: 500 }
    );
  }
} 