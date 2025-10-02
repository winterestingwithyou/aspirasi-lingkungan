import type { Route } from './+types/report';
import type { LoaderFunctionArgs } from 'react-router';
import { ReportPage } from '~/pages/report-page';

// Meta ala daftar-masalah
function meta({}: Route.MetaArgs) {
  return [
    { title: 'Form Pelaporan Masalah - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Laporkan masalah lingkungan yang Anda temukan.',
    },
  ];
}

async function loader({}: LoaderFunctionArgs) {
  return { initialMessage: 'Isi form untuk melaporkan masalah' };
}

function Report({ loaderData }: Route.ComponentProps) {
  return <ReportPage initialMessage={loaderData.initialMessage} />;
}

export default Report;
export { meta, loader };
