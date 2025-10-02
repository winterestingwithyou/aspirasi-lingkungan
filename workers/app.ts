import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';
import { getPrisma } from './db';
import { createReportSchema } from './schemas/reports';
import { zValidator } from '@hono/zod-validator';
import type { NominatimResponse } from './types';
import { sha1Hex } from './helpers/sha1';

type Env = {
  DATABASE_URL: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_FOLDER?: string;
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

// Endpoint untuk membuat laporan baru
api.post('/reports', zValidator('json', createReportSchema), async (c) => {
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

api.get('/cloudinary/sign', async (c) => {
  const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = c.env.CLOUDINARY_API_KEY;
  const apiSecret = c.env.CLOUDINARY_API_SECRET;
  const folder = c.env.CLOUDINARY_FOLDER ?? 'uploads';
  const timestamp = Math.floor(Date.now() / 1000);

  const params: Record<string, string | number> = {
    folder,
    timestamp,
  };

  console.log('Cloudinary params:', params);

  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  console.log('String to Sign:', toSign);

  const signature = await sha1Hex(toSign + apiSecret);

  console.log('Cloudinary signature:', signature);

  return c.json({ cloudName, apiKey, folder, timestamp, signature, toSign });
});

api.get('/reverse-geocode', async (c) => {
  const latStr = c.req.query('lat');
  const lonStr = c.req.query('lon');

  // Validasi sederhana
  const lat = Number(latStr);
  const lon = Number(lonStr);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return c.json({ error: 'Parameter lat/lon tidak valid' }, 400);
  }

  // Caching ringan 60 detik (di edge cache)
  const cacheKey = new Request(c.req.url, { method: 'GET' });
  const cache = (c.env as any)?.caches?.default as Cache | undefined;
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      // propagate hit dengan header tanda
      const hit = new Response(cached.body, cached);
      hit.headers.set('X-Cache', 'HIT');
      return hit;
    }
  }

  const userAgent = 'MyReactApp/1.0 (myemail@example.com)';

  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('format', 'json'); // atau 'jsonv2'
  // url.searchParams.set('addressdetails', '1');

  const upstream = await fetch(url.toString(), {
    headers: {
      'User-Agent': userAgent,
      Accept: 'application/json',
    },
    method: 'GET',
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    return c.json(
      {
        error: `Upstream Nominatim error (${upstream.status})`,
        detail: text?.slice(0, 300),
      },
      502,
    );
  }

  const data = (await upstream.json()) as NominatimResponse;

  // Normalisasi respons minimal
  const body = JSON.stringify({
    display_name: data.display_name ?? null,
    error: data.error ?? null,
    raw: data, // kalau tidak mau berat, hilangkan baris ini
  });

  // Simpan ke cache 60 detik (opsional)
  const resp = new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
      'X-Cache': 'MISS',
    },
    status: 200,
  });

  if (cache) await cache.put(cacheKey, resp.clone());
  return resp;
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
