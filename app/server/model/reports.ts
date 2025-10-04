import { Prisma } from '@prisma/client';
import { getPrisma } from '~/db/prisma';
import type { Report, ReportsResponse } from '~/types';

export async function listReports(
  dbUrl: string,
  { limit, cursor }: { limit: number; cursor?: string | null },
) {
  const prisma = await getPrisma(dbUrl);

  const take = Math.min(50, Math.max(1, Number.isFinite(limit) ? limit : 6));

  const cursorId = cursor ? Number(cursor) : undefined;
  if (cursorId !== undefined && Number.isNaN(cursorId)) {
    throw new Error('Invalid cursor');
  }

  const rows = await prisma.report.findMany({
    where: {},
    orderBy: { id: 'desc' },
    take: take + 1,
    cursor: cursorId ? { id: cursorId } : undefined,
    skip: cursorId ? 1 : 0,
    select: {
      id: true,
      reporterName: true,
      reporterContact: true,
      description: true,
      photoUrl: true,
      latitude: true,
      longitude: true,
      location: true,
      status: true,
      upvoteCount: true,
      isFakeReport: true,
      createdAt: true,
      resolvedAt: true,
      deletedAt: true,
      problemType: { select: { id: true, name: true } },
    },
  });

  const hasMore = rows.length > take;
  const pageItems = hasMore ? rows.slice(0, take) : rows;

  const nextCursor: number | null = hasMore
    ? pageItems[pageItems.length - 1].id
    : null;

  const data = pageItems.map((r) => {
    return {
      id: r.id,
      reporterName: r.reporterName,
      reporterContact: r.reporterContact ?? null,
      description: r.description,
      photoUrl: r.photoUrl ?? null,
      latitude:
        r.latitude instanceof Prisma.Decimal
          ? r.latitude.toNumber()
          : Number(r.latitude),
      longitude:
        r.longitude instanceof Prisma.Decimal
          ? r.longitude.toNumber()
          : Number(r.longitude),
      location: r.location ?? null,
      status: r.status,
      upvoteCount: r.upvoteCount,
      isFakeReport: r.isFakeReport,
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : String(r.createdAt),
      resolvedAt:
        r.resolvedAt instanceof Date
          ? r.resolvedAt.toISOString()
          : r.resolvedAt
            ? String(r.resolvedAt)
            : null,
      deletedAt:
        r.deletedAt instanceof Date
          ? r.deletedAt.toISOString()
          : r.deletedAt
            ? String(r.deletedAt)
            : null,
      problemType: r.problemType,
    } satisfies Report;
  });

  return { data, nextCursor, limit: take } satisfies ReportsResponse;
}
