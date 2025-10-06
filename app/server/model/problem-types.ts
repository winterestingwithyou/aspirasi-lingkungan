import { getPrisma } from '../../db/prisma';

async function listProblemTypes(dbUrl: string, includeDescription = false) {
  const prisma = await getPrisma(dbUrl);
  return prisma.problemType.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, description: includeDescription },
  });
}

async function createProblemType(
  dbUrl: string,
  data: { id?: number; name: string; description?: string | null },
) {
  const prisma = await getPrisma(dbUrl);
  const { id, ...createData } = data; // Ensure 'id' is not passed to create operation
  return prisma.problemType.create({ data: createData });
}

async function updateProblemType(
  dbUrl: string,
  id: number,
  data: { name: string; description?: string | null },
) {
  const prisma = await getPrisma(dbUrl);
  return prisma.problemType.update({ where: { id }, data });
}

async function deleteProblemType(dbUrl: string, id: number) {
  const prisma = await getPrisma(dbUrl);
  try {
    return await prisma.problemType.delete({ where: { id } });
  } catch (error: any) {
    // Handle case where problem type is still in use by reports
    if (error.code === 'P2003') {
      throw new Error('Jenis masalah ini tidak dapat dihapus karena masih digunakan oleh beberapa laporan.');
    }
    throw error;
  }
}


export { listProblemTypes, createProblemType, updateProblemType, deleteProblemType };
