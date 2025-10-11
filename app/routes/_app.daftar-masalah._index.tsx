import type { Route } from './+types/_app.daftar-masalah';
import type { ReportsResponse } from '~/types';
import { DaftarMasalahPage } from '~/pages/daftar-masalah-page';
import { listReports } from '~/server/model/reports';

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

async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const limitStr = url.searchParams.get('limit') ?? '6'; // Biarkan 6 untuk halaman publik
  const pageStr = url.searchParams.get('page') ?? '1';

  try {
    const limit = Number(limitStr);
    const page = Number(pageStr);
    const payload = await listReports(context.cloudflare.env.DATABASE_URL, {
      limit,
      page,
    });

    return payload satisfies ReportsResponse;
  } catch (err) {
    console.error('Failed to load reports:', err);
    return {
      data: [],
      nextCursor: null,
      limit: Number(limitStr) || 6,
    } satisfies ReportsResponse;
  }
}

// eslint-disable-next-line no-empty-pattern
function DaftarMasalah({}: Route.ComponentProps) {
  return <DaftarMasalahPage />;
}

export default DaftarMasalah;
export { meta, loader };
