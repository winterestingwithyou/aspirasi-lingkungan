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
    phase: string;
    status: ReportStatus;
    description: string;
    progressPhotoUrl: string;
  },
) {
  const prisma = await getPrisma(dbUrl);

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
      `Transisi status tidak diizinkan. Status sekarang: ${report.status}. Opsi: ${allowed.join(', ')}`,
    );
  }

  const previousStatus = report.status as ReportStatus;
  const nextStatus = payload.status;
  const isCompleting = nextStatus === ReportStatus.COMPLETED;

  const updated = await prisma.report.updateMany({
    where: {
      id: reportId,
      status: previousStatus,
      isFakeReport: false,
    },
    data: {
      status: nextStatus,
      ...(isCompleting ? { resolvedAt: new Date() } : {}),
    },
  });

  if (updated.count === 0) {
    // Status sudah berubah oleh proses lain; beri pesan yang jelas
    const latest = await prisma.report.findUnique({
      where: { id: reportId },
      select: { status: true },
    });
    const latestStatus = latest?.status ?? previousStatus;
    throw new Error(
      `Status laporan sudah berubah menjadi "${latestStatus}". Silakan muat ulang dan coba lagi.`,
    );
  }

  try {
    const progress = await prisma.reportProgress.create({
      data: {
        reportId,
        phase: payload.phase,
        reportStatus: nextStatus, // kolom baru menggantikan 'status' lama
        description: payload.description,
        progressPhotoUrl: payload.progressPhotoUrl,
        userId: 1, // TODO: ambil dari session/ctx
      },
    });

    return progress;
  } catch (err) {
    // Best-effort rollback (tidak menjamin sukses bila sudah ada perubahan lain)
    await prisma.report.updateMany({
      where: { id: reportId, status: nextStatus, isFakeReport: false },
      data: {
        status: previousStatus,
        ...(isCompleting ? { resolvedAt: null } : {}),
      },
    });
    throw err instanceof Error
      ? new Error(`Gagal menyimpan progress: ${err.message}`)
      : new Error('Gagal menyimpan progress karena kesalahan tak dikenal');
  }
}

export async function getReportProgressDetail(
  dbUrl: string,
  reportId: number,
  progressId: number,
) {
  const prisma = await getPrisma(dbUrl);
  try {
    const progress = await prisma.reportProgress.findFirst({
      where: { id: progressId, reportId },
      include: {
        report: {
          select: {
            id: true,
            reporterName: true,
            status: true,
            problemType: { select: { name: true } },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            departmentName: true,
          },
        },
      },
    });

    if (!progress) return null;

    return {
      id: progress.id,
      phase: progress.phase,
      description: progress.description,
      progressPhotoUrl: progress.progressPhotoUrl ?? null,
      createdAt:
        progress.createdAt instanceof Date
          ? progress.createdAt.toISOString()
          : String(progress.createdAt),
      reportStatus: progress.reportStatus,
      report: progress.report,
      user: progress.user,
    };
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
          phase: 'Menandai Laporan Palsu',
          reportStatus: ReportStatus.FAKE_REPORT,
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
