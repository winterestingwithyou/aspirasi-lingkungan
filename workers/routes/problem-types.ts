import { Hono } from 'hono';
import type { Context } from 'hono';
import { getPrisma } from 'workers/db';
import type { Env } from 'workers/types';

export const problemTypeRouter = new Hono<{ Bindings: Env }>();

// GET /api/problem-types
problemTypeRouter.get('/', async (c: Context) => {
  try {
    const prisma = await getPrisma(c.env.DATABASE_URL);

    // Sesuaikan nama model Prisma dengan schema kamu (umumnya: ProblemType)
    const items = await prisma.problemType.findMany({
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });

    return c.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch problem types:', err);
    return c.json(
      { error: 'Gagal mengambil jenis masalah. Coba lagi nanti.' },
      500,
    );
  }
});
