import GovEditLaporan from '~/pages/gov/gov-edit-laporan';
import type { Route } from './+types/gov.laporan.$id.edit';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Edit Laporan - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Halaman untuk mengedit laporan yang sudah dibuat.',
    },
  ];
}

export default function EditLaporan() {
  return <GovEditLaporan />;
}
