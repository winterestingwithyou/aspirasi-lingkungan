import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

async function getPrisma(datasourceUrl: string) {
  return new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
}

export { getPrisma };
