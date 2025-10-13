import type { Route } from './+types/gov.laporan.$id_.progress.$progressId';
import GovProgressDetail from '~/pages/gov/gov-progress-detail';
import { getReportProgressDetail } from '~/server/model/reportProgress';

function meta({ data }: Route.MetaArgs) {
  const title = data
    ? `Progress "${data.phase}" - Laporan #${data.report.id} | Eco Rapid`
    : 'Detail Progress Laporan';
  return [
    { title },
    {
      name: 'description',
      content: 'Lihat detail progress penanganan laporan aspirasi lingkungan.',
    },
  ];
}

async function loader({ context, params }: Route.LoaderArgs) {
  const reportId = Number(params.id);
  const progressId = Number(params.progressId);

  if (!Number.isFinite(reportId) || !Number.isFinite(progressId)) {
    throw new Response('ID tidak valid', { status: 400 });
  }

  const detail = await getReportProgressDetail(
    context.cloudflare.env.DATABASE_URL,
    reportId,
    progressId,
  );

  if (!detail) {
    throw new Response('Progress tidak ditemukan', { status: 404 });
  }

  return detail;
}

// eslint-disable-next-line no-empty-pattern
function Page({}: Route.ComponentProps) {
  return <GovProgressDetail />;
}

export { meta, loader, Page as default };
