import GovDashboard from '~/pages/gov/gov-dashboard';
import type { Route } from './+types/gov-dashboard';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard Pemerintah - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content:
        'Pantau laporan dan data lingkungan melalui dashboard pemerintah.',
    },
  ];
}

export default function Dashboard() {
  return <GovDashboard />;
}
