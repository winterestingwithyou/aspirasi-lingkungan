import type { Route } from './+types/_app.kontak';
import KontakPage from '~/pages/kontak-page';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Kontak - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Hubungi kami untuk pertanyaan, kritik, atau saran.',
    },
  ];
}

export default function Tentang() {
  return <KontakPage />;
}
