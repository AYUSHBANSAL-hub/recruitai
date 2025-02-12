import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      console.error('Session Error: No auth-token found');
      return null;
    }

    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    console.log('Session Retrieved:', payload);
    return payload;
  } catch (error) {
    console.error('Session Error:', error);
    return null;
  }
}

