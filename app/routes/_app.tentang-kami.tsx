import type { Route } from './+types/_app.tentang-kami';
import TentangKamiPage from '~/pages/tentang-kami-page';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tentang Kami - Eco Rapid' },
    {
      name: 'description',
      content:
        'Pelajari lebih lanjut tentang tujuan dan visi Eco Rapid.',
    },
  ];
}

export default function Tentang() {
  return <TentangKamiPage />;
}
