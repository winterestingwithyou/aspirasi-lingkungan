import type { AppLoadContext } from 'react-router';

interface CloudflareContext {
  env: {
    DATABASE_URL: string;
    [key: string]: string;
    TURNSTILE_SITE_KEY: string;
  };
  ctx: ExecutionContext;
}

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: CloudflareContext;
  }
}
