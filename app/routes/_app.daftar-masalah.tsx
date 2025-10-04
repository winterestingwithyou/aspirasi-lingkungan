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
  const limitStr = url.searchParams.get('limit') ?? '3';
  const cursor = url.searchParams.get('cursor');

  try {
    const limit = Number(limitStr);
    const payload = await listReports(context.cloudflare.env.DATABASE_URL, {
      limit,
      cursor,
    });

    return payload satisfies ReportsResponse;
  } catch (err) {
    console.error('Failed to load reports:', err);
    return {
      data: [],
      nextCursor: null,
      limit: Number(limitStr) || 12,
    } satisfies ReportsResponse;
  }
}

function DaftarMasalah({ loaderData }: Route.ComponentProps) {
  return <DaftarMasalahPage message={loaderData} />;
}

export default DaftarMasalah;
export { meta, loader };
