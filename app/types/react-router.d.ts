import type { AppLoadContext } from 'react-router';

interface CloudflareContext {
  env: {
    DATABASE_URL: string;
    [key: string]: string;
  };
  ctx: ExecutionContext;
}

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: CloudflareContext;
  }
}
