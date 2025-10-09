import GovPengaturan from '~/pages/gov/gov-pengaturan';
import type { Route } from '../+types/gov.pengaturan';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Pengaturan Pemerintah - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Kelola informasi Pengaturan instansi pemerintah.',
    },
  ];
}

export default function Pengaturan() {
  return <GovPengaturan />;
}
