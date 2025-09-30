export async function getPrisma(connectionString: string) {
  const { PrismaClient } = await import('../app/generated/prisma/edge');
  const { PrismaNeonHTTP } = await import('@prisma/adapter-neon');

  const adapter = new PrismaNeonHTTP(connectionString, {});
  return new PrismaClient({ adapter });
}
