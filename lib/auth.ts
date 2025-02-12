// src/lib/auth.ts
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) return null

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    )

    return payload
  } catch (error) {
    return null
  }
}