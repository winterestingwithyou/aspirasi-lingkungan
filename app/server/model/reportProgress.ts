import { getPrisma } from '~/db';
import { ReportStatus } from '~/prisma-enums';

const allowedNext: Record<ReportStatus, ReportStatus[]> = {
  PENDING: ['IN_PROGRESS'],
  IN_PROGRESS: ['IN_PROGRESS', 'COMPLETED'],
  COMPLETED: [],
  FAKE_REPORT: [],
};

/**
 * Ambil status laporan saat ini + apakah sudah fake
 */
export async function getReportState(dbUrl: string, reportId: number) {
  const prisma = await getPrisma(dbUrl);
  try {
    const r = await prisma.report.findUnique({
      where: { id: reportId },
      select: { id: true, status: true, isFakeReport: true },
    });
    return r;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Hitung opsi status yang diizinkan berdasarkan status saat ini.
 */
export function getAllowedNextStatuses(current: ReportStatus) {
  return allowedNext[current] ?? [];
}

/**
 * Tambah progress laporan + update status report (validasi transisi).
 * Mengembalikan progress terbaru.
 */
export async function addReportProgress(
  dbUrl: string,
  reportId: number,
  payload: {
    status: ReportStatus;
    description: string;
    progressPhotoUrl?: string | null;
  },
) {
  const prisma = await getPrisma(dbUrl);
  try {
    // Ambil status terkini
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: { id: true, status: true, isFakeReport: true },
    });

    if (!report) {
      throw new Error('Laporan tidak ditemukan');
    }
    if (report.isFakeReport) {
      throw new Error('Laporan telah ditandai palsu dan tidak bisa diubah');
    }

    const allowed = getAllowedNextStatuses(report.status as ReportStatus);
    if (!allowed.includes(payload.status)) {
      throw new Error(
        `Transisi status tidak diizinkan. Status sekarang: ${report.status}. Opsi: ${allowed.join(
          ', ',
        )}`,
      );
    }

    // Simpan progress + update status report sebagai transaksi
    const result = await prisma.$transaction(async (tx) => {
      const progress = await tx.reportProgress.create({
        data: {
          reportId,
          status: payload.status,
          description: payload.description,
          progressPhotoUrl: payload.progressPhotoUrl ?? null,
          userId: 1,
        },
      });

      await tx.report.update({
        where: { id: reportId },
        data: { status: payload.status },
      });

      return progress;
    });

    return result;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Tandai laporan sebagai palsu.
 * Opsional: simpan alasan sebagai progress catatan.
 */
export async function markReportAsFake(
  dbUrl: string,
  reportId: number,
  reason: string,
) {
  const prisma = await getPrisma(dbUrl);
  try {
    const updated = await prisma.report.updateMany({
      where: { id: reportId, isFakeReport: false },
      data: { isFakeReport: true, status: ReportStatus.FAKE_REPORT },
    });

    if (updated.count === 0) {
      return { id: reportId, isFakeReport: true };
    }

    if (reason.trim()) {
      await prisma.reportProgress.create({
        data: {
          reportId,
          status: 'Menandai Laporan Palsu',
          description: `Ditandai sebagai laporan palsu. Alasan: ${reason}`,
          progressPhotoUrl: null,
          userId: 1,
        },
      });
    }

    return { id: reportId, isFakeReport: true };
  } finally {
    await prisma.$disconnect();
  }
}
