import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';
import prisma from './db';

const app = new Hono();
const prismaClient = prisma;

app.get('/reports', async (c) => {
  const reports = await prismaClient.report.findMany({
    include: {
      problemType: true, // Sertakan data jenis masalah
    },
  });
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
