import type { ReportStatus } from '~/prisma-enums';

function badge(
  reportStatus: ReportStatus,
): Record<ReportStatus, string>[ReportStatus] {
  const mapping = {
    PENDING: 'status-pending',
    IN_PROGRESS: 'status-progress',
    COMPLETED: 'status-completed',
    FAKE_REPORT: 'status-fake',
  } satisfies Record<ReportStatus, string>;

  return mapping[reportStatus];
}

function statusText(
  reportStatus: ReportStatus,
): Record<ReportStatus, string>[ReportStatus] {
  const mapping = {
    PENDING: 'Menunggu Tindakan',
    IN_PROGRESS: 'Sedang Diproses',
    COMPLETED: 'Selesai',
    FAKE_REPORT: 'Laporan Palsu',
  } satisfies Record<ReportStatus, string>;

  return mapping[reportStatus];
}

export { badge, statusText };
