import GovDetailLaporan from '~/pages/gov/gov-detail-laporan';
import type { Route } from './+types/gov-detail-laporan';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Detail Laporan - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Lihat detail laporan aspirasi lingkungan secara lengkap.',
    },
  ];
}

export default function DetailLaporan() {
  return <GovDetailLaporan />;
}
