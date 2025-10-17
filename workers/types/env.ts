export type Env = {
  DATABASE_URL: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_FOLDER?: string;

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
