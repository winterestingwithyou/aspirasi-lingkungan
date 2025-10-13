import { countAllReports, countReportsByStatus } from '~/server/model/reports';
import type { Route } from './+types/_app._index';
import { LandingPage } from '~/pages/landing-page';
import type { ReportStats } from '~/types';
import { ReportStatus } from '~/prisma-enums';

// eslint-disable-next-line no-empty-pattern
function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beranda - Eco Rapid' },
    {
      name: 'description',
      content: 'Selamat datang di aplikasi Eco Rapid.',
    },
  ];
}

async function loader({ context }: Route.LoaderArgs) {
  const dbUrl = context.cloudflare.env.DATABASE_URL;

  try {
    const [all, pending, inProgress, completed] = await Promise.all([
      countAllReports(dbUrl),
      countReportsByStatus(dbUrl, ReportStatus.PENDING),
      countReportsByStatus(dbUrl, ReportStatus.IN_PROGRESS),
      countReportsByStatus(dbUrl, ReportStatus.COMPLETED),
    ]);
    return { all, pending, inProgress, completed } satisfies ReportStats;
  } catch (e) {
    console.error('Error loading report stats:', e);
    return {
      all: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    } satisfies ReportStats;
  }
}

// eslint-disable-next-line no-empty-pattern
function Index({}: Route.ComponentProps) {
  return <LandingPage />;
}

export { meta, loader, Index as default };
