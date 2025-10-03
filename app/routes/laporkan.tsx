import type { Route } from './+types/laporkan';
import { ReportPage } from '~/pages/report-page';
import { getProblemTypes } from '~/services';
import type { ProblemType } from '~/types';

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

async function loader({ request }: Route.LoaderArgs) {
  let problemTypes: ProblemType[] = [];
  let ptError: string | null = null;

  try {
    problemTypes = await getProblemTypes(request);
  } catch (err) {
    ptError = err instanceof Error ? err.message : 'Gagal memuat jenis masalah';
  }

  return {
    problemTypes,
    ptError,
  };
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
