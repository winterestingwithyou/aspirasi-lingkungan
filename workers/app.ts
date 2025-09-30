import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';
import { getPrisma } from './db';

type Env = { DATABASE_URL: string };

const app = new Hono();
const api = new Hono<{ Bindings: Env }>();

// Move the reports endpoint to api router
api.get('/reports', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const reports = await prisma.report.findMany({
    include: {
      problemType: true,
    },
  });
  await prisma.$disconnect();
  return c.json(reports);
});

api.get('/', async (c) => {
  const reports: { hai: string } = { hai: 'hello' };
  return c.json(reports);
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
