import type { Route } from './+types/gov.laporan._index';
import type { ReportsResponse } from '~/types'; // Pastikan Report juga diimpor jika diperlukan
import GovLaporanPage from '~/pages/gov/gov-laporan';
import { listReports } from '~/server/model/reports';

// eslint-disable-next-line no-empty-pattern
function meta({}: Route.MetaArgs) {
  return [
    { title: 'Daftar Laporan - Admin' },
    {
      name: 'description',
      content: 'Kelola semua laporan masalah yang masuk.',
    },
  ];
}

// Loader mengambil data dari Hono API: /api/reports
async function loader({ request, context }: Route.LoaderArgs) {
  const dbUrl = context.cloudflare.env.DATABASE_URL;

  const url = new URL(request.url);
  const limitStr = url.searchParams.get('limit') ?? '10';
  const pageStr = url.searchParams.get('page') ?? '1';

  const limit = Number(limitStr);
  const page = Number(pageStr);

  try {
    // Panggil service getReports dengan limit dan page, bukan cursor
    const response = await listReports(dbUrl, { limit, page });

    return {
      ...response,
      limit, // Pastikan limit adalah angka
    } satisfies ReportsResponse;
  } catch (err) {
    console.error('Failed to load reports for admin:', err);
    return {
      data: [],
      nextCursor: null,
      limit: limit,
    } satisfies ReportsResponse;
  }
}

// eslint-disable-next-line no-empty-pattern
function GovLaporan({}: Route.ComponentProps) {
  return <GovLaporanPage />;
}

export { meta, loader, GovLaporan as default };
