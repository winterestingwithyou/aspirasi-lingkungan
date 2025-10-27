import GovProfil from '~/pages/gov/gov-profil';
import type { Route } from './+types/gov.profil';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Profil Pemerintah - Eco Rapid' },
    {
      name: 'description',
      content: 'Kelola informasi profil instansi pemerintah.',
    },
  ];
}

export default function Profil() {
  return <GovProfil />;
}
