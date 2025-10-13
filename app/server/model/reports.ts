import { Prisma } from '~/generated/prisma/client';
import { getPrisma } from '~/db';
import type { Report, ReportDetail, ReportsResponse } from '~/types';
import type { CreateReportPayload } from '~/validators/reports';
import type { ReportStatus } from '~/prisma-enums';

async function listReports(
  dbUrl: string,
  {
    limit,
    cursor,
    page,
    search,
    status,
    problemTypeId,
  }: {
    limit: number;
    cursor?: number | null;
    page?: number;
    search?: string | null;
    status?: ReportStatus | null;
    problemTypeId?: number | null;
  },
): Promise<ReportsResponse> {
  const prisma = await getPrisma(dbUrl);

  // Gunakan limit yang diberikan, dengan default 10 jika tidak valid. Batasi maksimal 50.
  const take = Math.min(50, Number.isFinite(limit) && limit > 0 ? limit : 10);

  // Tentukan skip. Prioritaskan cursor. Jika tidak ada, gunakan page.
  let skip = 0;
  const cursorObj = cursor ? { id: cursor } : undefined;
  if (cursor) {
    skip = 1; // Skip the cursor item itself
  } else if (page && page > 1) {
    skip = (page - 1) * take;
  }

  const where: Prisma.ReportWhereInput = {
    deletedAt: null, // Selalu kecualikan yang soft-deleted
  };

  if (status) {
    where.status = status;
  }

  if (problemTypeId) {
    where.problemTypeId = problemTypeId;
  }

  if (search) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { problemType: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const rows = await prisma.report.findMany({
    ...(cursorObj ? { cursor: cursorObj, skip: 1 } : { skip: skip }),
    where,
    orderBy: { id: 'desc' },
    take: take + 1,
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

  const nextCursor = hasMore ? pageItems[pageItems.length - 1].id : null;

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

  return { data, nextCursor, limit: take };
}

async function createReport(dbUrl: string, data: CreateReportPayload) {
  const prisma = await getPrisma(dbUrl);

  // Pastikan field opsional diisi null bila kosong
  const newReport = await prisma.report.create({
    data: {
      reporterName: data.reporterName,
      reporterContact: data.reporterContact ?? null,
      description: data.description,
      photoUrl: data.photoUrl, // sudah berupa URL Cloudinary
      latitude: data.latitude,
      longitude: data.longitude,
      location: data.location ?? null,
      problemTypeId: data.problemTypeId,
      // kolom default: status, upvoteCount, dsb ditangani Prisma schema
    },
    select: { id: true },
  });

  return newReport;
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
 * Hitung jumlah laporan yang SELESAI "hari ini" (Asia/Jakarta), berdasarkan resolvedAt.
 * Menggunakan konversi batas hari Asia/Jakarta → UTC agar query efisien.
 */
async function countTodayCompletedReports(dbUrl: string): Promise<number> {
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
      status: 'COMPLETED',
      resolvedAt: { gte: startUtc, lt: endUtc },
    },
  });
}

/**
 * Hitung jumlah laporan untuk status tertentu (exclude soft-deleted).
 * @param dbUrl - URL database
 * @param status - Status laporan yang ingin dihitung
 * @returns Jumlah laporan dengan status tersebut
 */
async function countReportsByStatus(
  dbUrl: string,
  status: ReportStatus,
): Promise<number> {
  const prisma = await getPrisma(dbUrl);

  return prisma.report.count({
    where: {
      deletedAt: null,
      status: status,
    },
  });
}

export {
  createReport,
  listReports,
  getReportDetailById,
  countAllReports,
  countTodayReports,
  countTodayCompletedReports,
  countReportsByStatus,
};
