import { Hono } from 'hono';
import { getPrisma } from 'workers/db';
import { createReportSchema } from 'workers/schemas/reports';
import { zValidator } from '@hono/zod-validator';
import type { Env } from '../types';
import {
  listReports,
  countReportsByStatus,
  countTodayCompletedReports,
  countTodayReports,
} from '~/server/model/reports';

export const reportsRouter = new Hono<{ Bindings: Env }>();

// GET /api/reports
// Query: ?limit=20&cursor=123
reportsRouter.get('/', async (c) => {
  const dbUrl = c.env.DATABASE_URL;

  // ambil query param dengan default & batasan
  const limitRaw = c.req.query('limit') ?? '20';
  const cursorRaw = c.req.query('cursor'); // id terakhir yang sudah diterima
  const limit = Math.min(Math.max(parseInt(limitRaw, 10) || 20, 1), 100);

  try {
    const result = await listReports(dbUrl, { limit, cursor: cursorRaw });
    return c.json(result);
  } catch (error) {
    console.error('Failed to list reports:', error);
    return c.json({ error: 'Gagal mengambil daftar laporan' }, 500);
  }
});

// GET /api/reports/stats
reportsRouter.get('/stats', async (c) => {
  const dbUrl = c.env.DATABASE_URL;

  try {
    const [today, todayCompleted, byStatus] = await Promise.all([
      countTodayReports(dbUrl),
      countTodayCompletedReports(dbUrl),
      countReportsByStatus(dbUrl),
    ]);

    const stats = {
      today,
      todayCompleted,
      pending: byStatus.get('PENDING') ?? 0,
      inProgress: byStatus.get('IN_PROGRESS') ?? 0,
      completed: byStatus.get('COMPLETED') ?? 0,
      fake: byStatus.get('FAKE_REPORT') ?? 0,
    };

    return c.json({ data: stats });
  } catch (error) {
    console.error('Failed to fetch report stats:', error);
    return c.json({ error: 'Gagal mengambil statistik laporan' }, 500);
  }
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
