import type { Route } from './+types/index';
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

export default function index() {
  return <LandingPage />;
}
