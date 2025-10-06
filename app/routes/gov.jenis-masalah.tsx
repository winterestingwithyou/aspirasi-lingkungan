import GovJenisMasalah from '~/pages/gov/gov-jenis-masalah';
import type { Route } from './+types/gov.jenis-masalah';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Jenis Masalah - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Halaman untuk kelola jenis masalah.',
    },
  ];
}

export default function JenisMasalah() {
  return <GovJenisMasalah />;
}
