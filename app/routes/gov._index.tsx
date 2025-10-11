import type { Route } from './+types/gov._index';
import GovDashboard from '~/pages/gov/gov-dashboard';
import { ReportStatus } from '~/prisma-enums';
import {
  countAllReports,
  countReportsByStatus,
  countTodayCompletedReports,
  listReports,
} from '~/server/model/reports';
import type { ReportsResponse, ReportStats } from '~/types';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard Pemerintah - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content:
        'Pantau laporan dan data lingkungan melalui dashboard pemerintah.',
    },
  ];
}

// Loader untuk mengambil statistik dan 3 laporan terbaru
export async function loader({ context }: Route.LoaderArgs) {
  const dbUrl = context.cloudflare.env.DATABASE_URL;
  try {
    // Ambil data secara paralel menggunakan request yang sama
    const [
      recentReportsResponse,
      all,
      pending,
      inProgress,
      completed,
      fake,
      todayCompleted,
    ] = await Promise.all([
      listReports(dbUrl, { limit: 3, page: 1 }),
      countAllReports(dbUrl),
      countReportsByStatus(dbUrl, ReportStatus.PENDING),
      countReportsByStatus(dbUrl, ReportStatus.IN_PROGRESS),
      countReportsByStatus(dbUrl, ReportStatus.COMPLETED),
      countReportsByStatus(dbUrl, ReportStatus.FAKE_REPORT),
      countTodayCompletedReports(dbUrl),
    ]);

    // Ekstrak data dari masing-masing response
    const recentReports = recentReportsResponse;
    const stats = {
      all,
      pending,
      inProgress,
      completed,
      fake,
      todayCompleted,
    } satisfies ReportStats;

    return { recentReports, stats };
  } catch (err) {
    console.error('Failed to load recent reports for dashboard:', err);
    // Jika gagal, kembalikan data kosong agar halaman tidak error
    return {
      recentReports: {
        data: [],
        nextCursor: null,
        limit: 3,
      } satisfies ReportsResponse,
      stats: null,
    };
  }
}

// eslint-disable-next-line no-empty-pattern
export default function Dashboard({}: Route.ComponentProps) {
  return <GovDashboard />;
}
