import { Hono } from 'hono';
import type { Env } from 'workers/types';
import { nominatimRouter } from './nominatim';
import { cloudinaryRouter } from './cloudinary';

export const apiRouter = new Hono<{ Bindings: Env }>();

apiRouter.route('/nominatim', nominatimRouter);
apiRouter.route('/cloudinary', cloudinaryRouter);
