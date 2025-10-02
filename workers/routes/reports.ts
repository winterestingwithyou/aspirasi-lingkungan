import { Hono } from 'hono';
import { getPrisma } from 'workers/db';
import { createReportSchema } from 'workers/schemas/reports';
import { zValidator } from '@hono/zod-validator';
import type { Env } from '../types';

export const reportsRouter = new Hono<{ Bindings: Env }>();

// GET /api/reports
// Query: ?limit=20&cursor=123
reportsRouter.get('/', async (c) => {
  const prisma = await getPrisma(c.env.DATABASE_URL);

  // ambil query param dengan default & batasan
  const limitRaw = c.req.query('limit') ?? '20';
  const cursorRaw = c.req.query('cursor'); // id terakhir yang sudah diterima
  const limit = Math.min(Math.max(parseInt(limitRaw, 10) || 20, 1), 100);
  const cursor = cursorRaw ? Number(cursorRaw) : undefined;

  // kalau kamu pakai soft-delete, biasanya kita sembunyikan yang deleted
  const where = { deletedAt: null as Date | null };

  // orderBy id desc supaya konsisten dengan cursor id
  const items = await prisma.report.findMany({
    take: limit + 1, // ambil 1 ekstra untuk tahu nextCursor
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where,
    orderBy: { id: 'desc' },
    include: {
      problemType: true,
      progressUpdates: {
        orderBy: { createdAt: 'desc' },
        take: 3, // batasi biar response ringan
      },
    },
  });

  let nextCursor: number | null = null;
  if (items.length > limit) {
    const next = items.pop()!;
    nextCursor = next.id;
  }

  return c.json({
    data: items,
    nextCursor,
    limit,
  });
});

// POST /api/reports
// Endpoint untuk membuat laporan baru
reportsRouter.post('/', zValidator('json', createReportSchema), async (c) => {
  const prisma = await getPrisma(c.env.DATABASE_URL);
  const body = c.req.valid('json');

  try {
    const newReport = await prisma.report.create({
      data: {
        // kolom yang WAJIB di schema
        reporterName: body.reporterName,
        description: body.description,
        photoUrl: body.photoUrl,
        latitude: body.latitude, // Prisma Decimal akan menerima number
        longitude: body.longitude,
        problemTypeId: body.problemTypeId,

        // kolom OPSIONAL
        reporterContact: body.reporterContact ?? null,
        location: body.location ?? null,

        // kolom lain mengikuti default di schema Prisma:
        // status        -> default PENDING
        // upvoteCount   -> default 0
        // isFakeReport  -> default false
        // createdAt     -> default now()
        // resolvedAt    -> null
        // deletedAt     -> null
      },
    });

    return c.json({ message: 'Laporan berhasil dibuat', data: newReport }, 201);
  } catch (error) {
    console.error('Gagal menyimpan laporan:', error);
    return c.json({ error: 'Gagal menyimpan laporan ke database' }, 500);
  }
});
