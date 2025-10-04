import GovDashboard from '~/pages/gov/gov-dashboard';
import type { Route } from './+types/gov-index';
import { getReportStats, getReports } from '~/services/index'; // Pastikan path import benar
import type { ReportsResponse } from '~/types';

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
export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Ambil data secara paralel menggunakan request yang sama
    const [recentReportsResponse, statsResponse] = await Promise.all([
      getReports({ limit: '3', cursor: '' }, request),
      getReportStats(request),
    ]);

    // Ekstrak data dari masing-masing response
    const recentReports = recentReportsResponse;
    const stats = statsResponse.data;

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

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <GovDashboard loaderData={loaderData} />;
}
