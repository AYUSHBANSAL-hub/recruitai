import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
