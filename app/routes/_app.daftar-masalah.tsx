import type { Route } from './+types/_app.daftar-masalah';
import type { ReportsResponse } from '~/types';
import { getReports } from '~/services';
import { DaftarMasalahPage } from '~/pages/daftar-masalah-page';

// eslint-disable-next-line no-empty-pattern
function meta({}: Route.MetaArgs) {
  return [
    { title: 'Daftar Masalah - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content:
        'Lihat semua laporan masalah lingkungan yang telah diajukan oleh warga.',
    },
  ];
}

// Loader mengambil data dari Hono API: /api/reports
async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') ?? '6';
  const cursor = url.searchParams.get('cursor') ?? '';

  try {
    const data = await getReports({ limit, cursor }, request);
    return data;
  } catch (err) {
    console.error('Failed to load reports:', err);
    return {
      data: [],
      nextCursor: null,
      limit: Number(limit),
    } satisfies ReportsResponse;
  }
}

function DaftarMasalah({ loaderData }: Route.ComponentProps) {
  return <DaftarMasalahPage message={loaderData} />;
}

export default DaftarMasalah;
export { meta, loader };
