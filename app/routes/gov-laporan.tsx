import type { Route } from './+types/gov-laporan';
import type { ReportsResponse } from '~/types';
import { getReports } from '~/services';
import GovLaporanPage from '~/pages/gov/gov-laporan';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Daftar Laporan - Admin' },
    {
      name: 'description',
      content: 'Kelola semua laporan masalah yang masuk.',
    },
  ];
}

// Loader mengambil data dari Hono API: /api/reports
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') ?? '10';
  const cursor = url.searchParams.get('cursor') ?? '';

  try {
    const data = await getReports({ limit, cursor }, request);
    return data;
  } catch (err) {
    console.error('Failed to load reports for admin:', err);
    return {
      data: [],
      nextCursor: null,
      limit: Number(limit),
    } satisfies ReportsResponse;
  }
}

export default function GovLaporan({ loaderData }: Route.ComponentProps) {
  return <GovLaporanPage reportsResponse={loaderData as ReportsResponse} />;
}