import type { AppLoadContext } from 'react-router';

interface CloudflareContext {
  env: {
    DATABASE_URL: string;
    [key: string]: string;
  };
  ctx: ExecutionContext;
  cf: IncomingRequestCfProperties | undefined;
}

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: CloudflareContext;
  }
}
