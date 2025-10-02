import { Hono } from 'hono';
import { sha1Hex } from 'workers/helpers/sha1';
import type { Env } from 'workers/types';

export const cloudinaryRouter = new Hono<{ Bindings: Env }>();

cloudinaryRouter.get('/sign', async (c) => {
  const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = c.env.CLOUDINARY_API_KEY;
  const apiSecret = c.env.CLOUDINARY_API_SECRET;
  const folder = c.env.CLOUDINARY_FOLDER ?? 'uploads';
  const timestamp = Math.floor(Date.now() / 1000);

  const params: Record<string, string | number> = {
    folder,
    timestamp,
  };

  console.log('Cloudinary params:', params);

  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  console.log('String to Sign:', toSign);

  const signature = await sha1Hex(toSign + apiSecret);

  console.log('Cloudinary signature:', signature);

  return c.json({ cloudName, apiKey, folder, timestamp, signature, toSign });
});
