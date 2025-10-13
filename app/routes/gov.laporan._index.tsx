import type { Route } from './+types/gov.laporan._index';
import type { ProblemType, ReportsResponse } from '~/types';
import GovLaporanPage from '~/pages/gov/gov-laporan';
import { listReports } from '~/server/model/reports';
import { listProblemTypes } from '~/server/model/problem-types';
import type { ReportStatus } from '~/prisma-enums';

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

async function loader({ request, context }: Route.LoaderArgs) {
  const dbUrl = context.cloudflare.env.DATABASE_URL;

  const url = new URL(request.url);
  const limitStr = url.searchParams.get('limit') ?? '10';
  const pageStr = url.searchParams.get('page') ?? '1';
  const search = url.searchParams.get('q');
  const status = url.searchParams.get('status') as ReportStatus | null;
  const problemTypeIdStr = url.searchParams.get('category');

  const limit = Number(limitStr);
  const page = Number(pageStr);
  const problemTypeId = problemTypeIdStr ? Number(problemTypeIdStr) : null;

  try {
    const reportsPayload = await listReports(dbUrl, {
      limit,
      page,
      search,
      status,
      problemTypeId,
    });

    const problemTypes = await listProblemTypes(dbUrl);

    return {
      reports: reportsPayload,
      problemTypes,
    } satisfies { reports: ReportsResponse; problemTypes: ProblemType[] };
  } catch (err) {
    console.error('Failed to load reports for admin:', err);
    return {
      reports: {
        data: [],
        nextCursor: null,
        limit: limit,
      },
      problemTypes: [],
    } satisfies { reports: ReportsResponse; problemTypes: ProblemType[] };
  }
}

// eslint-disable-next-line no-empty-pattern
function GovLaporan({}: Route.ComponentProps) {
  return <GovLaporanPage />;
}

export { meta, loader, GovLaporan as default };
