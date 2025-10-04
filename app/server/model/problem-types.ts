import { getPrisma } from '../../db/prisma';

async function listProblemTypes(dbUrl: string) {
  const prisma = await getPrisma(dbUrl);
  return prisma.problemType.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
}

export { listProblemTypes };
