import type { Route } from './+types/_app.daftar-masalah._index';
import type { ProblemType, ReportsResponse } from '~/types';
import { DaftarMasalahPage } from '~/pages/daftar-masalah-page';
import { listReports } from '~/server/model/reports';
import { listProblemTypes } from '~/server/model/problem-types';
import type { ReportStatus } from '~/prisma-enums';

// eslint-disable-next-line no-empty-pattern
function meta({}: Route.MetaArgs) {
  return [
    { title: 'Daftar Masalah - Eco Rapid' },
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
  const search = url.searchParams.get('q');
  const status = url.searchParams.get('status') as ReportStatus | null;
  const problemTypeIdStr = url.searchParams.get('category');

  try {
    const limit = Number(limitStr);
    const page = Number(pageStr);
    const problemTypeId = problemTypeIdStr ? Number(problemTypeIdStr) : null;

    const payload = await listReports(context.cloudflare.env.DATABASE_URL, {
      limit,
      page,
      search,
      status,
      problemTypeId,
    });

    const problemTypes = await listProblemTypes(
      context.cloudflare.env.DATABASE_URL,
    );

    return {
      reports: payload,
      problemTypes,
    } satisfies { reports: ReportsResponse; problemTypes: ProblemType[] };
  } catch (err) {
    console.error('Failed to load reports:', err);
    return {
      reports: {
        data: [],
        nextCursor: null,
        limit: Number(limitStr) || 6,
      },
      problemTypes: [],
    } satisfies { reports: ReportsResponse; problemTypes: ProblemType[] };
  }
}

// eslint-disable-next-line no-empty-pattern
function DaftarMasalah({}: Route.ComponentProps) {
  return <DaftarMasalahPage />;
}

export { meta, loader, DaftarMasalah as default };
