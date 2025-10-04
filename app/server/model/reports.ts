import { Prisma, ReportStatus } from '@prisma/client';
import { getPrisma } from '~/db/prisma';
import type { Report, ReportDetail, ReportsResponse } from '~/types';

async function listReports(
  dbUrl: string,
  { limit, cursor }: { limit: number; cursor?: string | null },
): Promise<ReportsResponse> {
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

/**
 * Mengambil detail satu laporan berdasarkan id.
 * - Mengabaikan yang sudah soft-deleted (deletedAt != null).
 * - Memuat relasi problemType dan progress (beserta user).
 * - Urutkan progress berdasarkan waktu naik (chronological).
 */
async function getReportDetailById(
  dbUrl: string,
  id: number,
): Promise<ReportDetail | null> {
  const prisma = await getPrisma(dbUrl);

  return prisma.report.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      problemType: true,
      progressUpdates: {
        include: {
          user: {
            select: { id: true, username: true, email: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

/**
 * Hitung jumlah seluruh laporan (exclude soft-deleted).
 */
async function countAllReports(dbUrl: string): Promise<number> {
  const prisma = await getPrisma(dbUrl);

  return prisma.report.count({
    where: { deletedAt: null },
  });
}

/**
 * Hitung jumlah laporan "hari ini" (Asia/Jakarta), berdasarkan createdAt.
 * Menggunakan konversi batas hari Asia/Jakarta → UTC agar query efisien.
 */
async function countTodayReports(dbUrl: string): Promise<number> {
  const prisma = await getPrisma(dbUrl);

  // Jakarta tidak pakai DST → offset konstan +7 jam
  const JKT_OFFSET_MS = 7 * 60 * 60 * 1000;

  const nowUtc = new Date();
  const nowJkt = new Date(nowUtc.getTime() + JKT_OFFSET_MS);
  const startOfDayJkt = new Date(
    nowJkt.getFullYear(),
    nowJkt.getMonth(),
    nowJkt.getDate(),
    0,
    0,
    0,
    0,
  );
  const endOfDayJkt = new Date(startOfDayJkt.getTime() + 24 * 60 * 60 * 1000);

  // Kembalikan ke UTC untuk dipakai di DB
  const startUtc = new Date(startOfDayJkt.getTime() - JKT_OFFSET_MS);
  const endUtc = new Date(endOfDayJkt.getTime() - JKT_OFFSET_MS);

  return prisma.report.count({
    where: {
      deletedAt: null,
      createdAt: {
        gte: startUtc,
        lt: endUtc,
      },
    },
  });
}

/**
 * Hitung jumlah laporan per status (exclude soft-deleted).
 * Mengembalikan Map<ReportStatus, number>
 */
async function countReportsByStatus(
  dbUrl: string,
): Promise<Map<ReportStatus, number>> {
  const prisma = await getPrisma(dbUrl);

  const rows = await prisma.report.groupBy({
    by: ['status'],
    where: { deletedAt: null },
    _count: { _all: true },
  });

  const map = new Map<ReportStatus, number>();
  for (const row of rows) {
    map.set(row.status as ReportStatus, row._count._all);
  }
  // Pastikan semua status ada kunci-nya (0 jika tidak ada data)
  (
    ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAKE_REPORT'] as ReportStatus[]
  ).forEach((st) => {
    if (!map.has(st)) map.set(st, 0);
  });

  return map;
}

export {
  listReports,
  getReportDetailById,
  countAllReports,
  countTodayReports,
  countReportsByStatus,
};
