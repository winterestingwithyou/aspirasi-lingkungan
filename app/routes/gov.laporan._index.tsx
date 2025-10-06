import type { Route } from './+types/gov.laporan._index';
import type { Report, ReportsResponse } from '~/types'; // Pastikan Report juga diimpor jika diperlukan
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

// Definisikan tipe data untuk nilai kembalian loader
export type GovLaporanLoaderData = ReportsResponse;

// Loader mengambil data dari Hono API: /api/reports
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const limitStr = url.searchParams.get('limit') ?? '10';
  const pageStr = url.searchParams.get('page') ?? '1';

  const limit = Number(limitStr);
  const page = Number(pageStr);

  try {
    // Panggil service getReports dengan limit dan page, bukan cursor
    const response = await getReports({
      limit: limit.toString(),
      page: page.toString(),
    }, request);

    return {
      ...response,
      limit, // Pastikan limit adalah angka
    } satisfies GovLaporanLoaderData;
  } catch (err) {
    console.error('Failed to load reports for admin:', err);
    return {
      data: [],
      nextCursor: null,
      limit: limit,
    } satisfies GovLaporanLoaderData;
  }
}

export default function GovLaporan({ loaderData }: Route.ComponentProps) {
  return <GovLaporanPage reportsResponse={loaderData as GovLaporanLoaderData} />;
}
