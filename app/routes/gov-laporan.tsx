import GovLaporan from '~/pages/gov/gov-laporan';
import type { Route } from './+types/gov-laporan';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Daftar Laporan - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Lihat semua laporan aspirasi lingkungan yang masuk.',
    },
  ];
}

export default function laporan() {
  return <GovLaporan />;
}
