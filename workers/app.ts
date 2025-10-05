import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';
import type { Env } from './types';
import { apiRouter } from './routes/api';

const app = new Hono<{ Bindings: Env }>();

app.route('/api', apiRouter);

// Keep the React Router handler at root level
app.all('*', (c) => {
  const requestHandler = createRequestHandler(
    () => import('virtual:react-router/server-build'),
    import.meta.env.MODE,
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;
