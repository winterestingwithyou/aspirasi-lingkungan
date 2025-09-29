import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';
import { getPrisma } from './db';

type Env = { DATABASE_URL: string };

const app = new Hono<{ Bindings: Env }>();

app.get('/reports', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const reports = await prisma.report.findMany({
    include: {
      problemType: true, // Sertakan data jenis masalah
    },
  });
  await prisma.$disconnect();
  return c.json(reports);
});

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
