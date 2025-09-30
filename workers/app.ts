import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';
import { getPrisma } from './db';

type Env = { DATABASE_URL: string };

const app = new Hono();
const api = new Hono<{ Bindings: Env }>();

api.get('/reverse-geocode', async (c) => {
  const lat = c.req.query('lat');
  const lon = c.req.query('lon');

  if (!lat || !lon) {
    return c.json({ error: 'Parameter lat dan lon wajib diisi' }, 400);
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MyHonoApp/1.0 (myemail@example.com)', // wajib biar tidak diblok
        },
      },
    );

    if (!res.ok) {
      return c.json({ error: 'Gagal request ke Nominatim' }, 500);
    }

    const data = await res.json();
    return c.json({ display_name: data.display_name });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Terjadi kesalahan server' }, 500);
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
