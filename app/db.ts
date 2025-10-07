import { PrismaClient } from '~/generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

async function getPrisma(datasourceUrl: string) {
  return new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
}

export { getPrisma };
