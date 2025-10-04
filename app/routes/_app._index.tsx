import { countAllReports, countReportsByStatus } from '~/server/model/reports';
import type { Route } from './+types/_app._index';
import LandingPage from '~/pages/landing-page';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beranda - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Selamat datang di aplikasi Web Aspirasi Lingkungan.',
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const dbUrl = context.cloudflare.env.DATABASE_URL;

  try {
    const [all, pending, inProgress, completed] = await Promise.all([
      countAllReports(dbUrl),
      countReportsByStatus(dbUrl, 'PENDING'),
      countReportsByStatus(dbUrl, 'IN_PROGRESS'),
      countReportsByStatus(dbUrl, 'COMPLETED'),
    ]);
    return { all, pending, inProgress, completed };
  } catch (e) {
    console.error('Error loading report stats:', e);
    return { all: 0, pending: 0, inProgress: 0, completed: 0 };
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <LandingPage
      all={loaderData.all}
      completed={loaderData.completed}
      inProgress={loaderData.inProgress}
      pending={loaderData.pending}
    />
  );
}
