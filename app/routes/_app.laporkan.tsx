import type { Route } from './+types/_app.laporkan';
import { ReportPage } from '~/pages/report-page';
import { listProblemTypes } from '~/server/model/problem-types';

// eslint-disable-next-line no-empty-pattern
function meta({}: Route.MetaArgs) {
  return [
    { title: 'Form Pelaporan Masalah - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Laporkan masalah lingkungan yang Anda temukan.',
    },
  ];
}

async function loader({ context }: Route.LoaderArgs) {
  try {
    const problemTypes = await listProblemTypes(
      context.cloudflare.env.DATABASE_URL,
    );
    return { problemTypes, ptError: null };
  } catch (e) {
    console.error('Error loading problem types:', e);
    return { problemTypes: [], ptError: 'Gagal memuat jenis masalah' };
  }
}

function Report({ loaderData }: Route.ComponentProps) {
  return (
    <ReportPage
      problemTypes={loaderData.problemTypes}
      ptError={loaderData.ptError}
    />
  );
}

export default Report;
export { meta, loader };
