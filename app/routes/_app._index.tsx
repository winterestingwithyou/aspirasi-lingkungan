import type { Route } from './+types/_app._index';
import LandingPage from '~/pages/landing-page';
import { getReportStats } from '~/services/index';

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

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const statsResponse = await getReportStats(request);
    // Ambil object 'data' dari response stats
    return { stats: statsResponse.data };
  } catch (err) {
    console.error('Failed to load report stats for landing page:', err);
    return { stats: null };
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return <LandingPage stats={loaderData.stats} />;
}
