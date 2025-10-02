import { Hono } from 'hono';
import type { Env, NominatimResponse } from 'workers/types';

export const nominatimRouter = new Hono<{ Bindings: Env }>();

nominatimRouter.get('/reverse', async (c) => {
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
