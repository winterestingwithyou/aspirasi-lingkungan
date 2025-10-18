import type { AppLoadContext } from 'react-router';

interface CloudflareContext {
  env: {
    VALUE_FROM_CLOUDFLARE: 'Hello from Hono/CF';

    DATABASE_URL: string;

    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_FOLDER: string;

    TURNSTILE_SITE_KEY: string;
    TURNSTILE_SECRET_KEY: string;

    SITE_NAME: string;
    CONTACT_TO: string;
    GMAIL_CLIENT_ID: string;
    GMAIL_CLIENT_SECRET: string;
    GMAIL_REFRESH_TOKEN: string;
    GMAIL_SENDER_EMAIL: string;

    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
  };
  ctx: ExecutionContext;
}

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: CloudflareContext;
  }
}
