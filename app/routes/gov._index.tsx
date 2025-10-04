import GovDashboard from '~/pages/gov/gov-dashboard';
import type { Route } from './+types/gov._index';
import { getReports } from '~/services';
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

// Loader untuk mengambil 3 laporan terbaru
export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Ambil 3 laporan terbaru, tanpa cursor
    const data = await getReports({ limit: '3', cursor: '' }, request);
    return data;
  } catch (err) {
    console.error('Failed to load recent reports for dashboard:', err);
    // Jika gagal, kembalikan data kosong agar halaman tidak error
    return {
      data: [],
      nextCursor: null,
      limit: 3,
    } satisfies ReportsResponse;
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <GovDashboard recentReports={loaderData} />;
}
