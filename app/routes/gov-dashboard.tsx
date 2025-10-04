import GovDashboard from '~/pages/gov/gov-dashboard';
import type { Route } from './+types/gov-dashboard';
import { getReports, getStats } from '~/services';
import type { ReportsResponse, Stats } from '~/types';

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

// Loader untuk mengambil data statistik dan 3 laporan terbaru
export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Ambil data laporan dan statistik secara paralel
    const [reportsResponse, statsResponse] = await Promise.all([
      getReports({ limit: '3', cursor: '' }, request),
      getStats(request), // Memanggil endpoint /api/stats
    ]);

    return {
      recentReports: reportsResponse,
      stats: statsResponse.stats,
    };
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    // Jika gagal, kembalikan data kosong agar halaman tidak error
    return {
      recentReports: {
        data: [],
        nextCursor: null,
        limit: 3,
      } satisfies ReportsResponse,
      stats: {
        today: { incoming: 0, completed: 0 },
        overall: { completed: 0, inProgress: 0, pending: 0 },
      } satisfies Stats,
    };
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <GovDashboard dashboardData={loaderData} />;
}
