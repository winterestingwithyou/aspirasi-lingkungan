import { Hono } from 'hono';
import type { Env } from 'workers/types';
import { reportsRouter } from './reports';
import { nominatimRouter } from './nominatim';
import { cloudinaryRouter } from './cloudinary';
import { problemTypeRouter } from './problem-types';

export const apiRouter = new Hono<{ Bindings: Env }>();

apiRouter.route('/reports', reportsRouter);
apiRouter.route('/nominatim', nominatimRouter);
apiRouter.route('/cloudinary', cloudinaryRouter);
apiRouter.route('/problem-types', problemTypeRouter);
