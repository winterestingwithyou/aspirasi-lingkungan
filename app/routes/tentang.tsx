import type { Route } from './+types/tentang';
import TentangKamiPage from '~/pages/tentang-kami-page';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tentang Kami - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content:
        'Pelajari lebih lanjut tentang tujuan dan visi Web Aspirasi Lingkungan.',
    },
  ];
}

export default function Tentang() {
  return <TentangKamiPage />;
}
