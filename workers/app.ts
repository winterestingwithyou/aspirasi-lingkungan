import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createRequestHandler } from 'react-router';
import { getPrisma } from './db';

type Env = {
  DATABASE_URL: string;
};

const app = new Hono();
const api = new Hono<{ Bindings: Env }>();

// Query: ?limit=20&cursor=123
api.get('/reports', async (c) => {
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

// Skema validasi untuk laporan baru menggunakan Zod
const createReportSchema = z.object({
  reporterName: z.string().min(3, 'Nama pelapor diperlukan'),
  reporterContact: z.string().min(10, 'Nomor Whatsapp tidak valid'),
  problemTypeId: z.coerce.number().int().positive('Jenis masalah tidak valid'),
  description: z.string().min(10, 'Deskripsi terlalu pendek'),
  photoUrl: z.string().url('URL foto tidak valid'),
  location: z.string().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

// Endpoint untuk membuat laporan baru
api.post('/reports', zValidator('json', createReportSchema), async (c) => {
  const prisma = await getPrisma(c.env.DATABASE_URL);
  const reportData = c.req.valid('json');

  try {
    const newReport = await prisma.report.create({
      data: {
        ...reportData,
        // Prisma akan menangani konversi tipe data Decimal secara otomatis
      },
    });

    return c.json(
      {
        message: 'Laporan berhasil dibuat',
        data: newReport,
      },
      201,
    ); // 201 Created
  } catch (error) {
    console.error('Gagal menyimpan laporan:', error);
    return c.json({ error: 'Gagal menyimpan laporan ke database' }, 500);
  }
});

// Mount the api router with /api prefix
app.route('/api', api);

// Keep the React Router handler at root level
app.get('*', (c) => {
  const requestHandler = createRequestHandler(
    () => import('virtual:react-router/server-build'),
    import.meta.env.MODE,
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;
