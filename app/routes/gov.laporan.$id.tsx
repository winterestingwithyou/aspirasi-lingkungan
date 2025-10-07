import GovDetailLaporan from '~/pages/gov/gov-detail-laporan';
import { getReportDetailById } from '~/server/model/reports';
import type { Route } from './+types/gov.laporan.$id';

export function meta({ data }: Route.MetaArgs) {
  const reportTitle = data?.problemType
    ? `Laporan #${data.id} - ${data.problemType?.name}`
    : 'Detail Laporan';
  return [
    { title: `${reportTitle} - Web Aspirasi Lingkungan` },
    {
      name: 'description',
      content: 'Lihat detail laporan aspirasi lingkungan secara lengkap.',
    },
  ];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const reportId = Number(params.id);
  if (isNaN(reportId)) {
    throw new Response(JSON.stringify({ message: 'ID Laporan tidak valid' }), {
      status: 400,
    });
  }

  const reportDetail = await getReportDetailById(
    context.cloudflare.env.DATABASE_URL,
    reportId,
  );

  if (!reportDetail) {
    throw new Response(JSON.stringify({ message: 'Laporan tidak ditemukan' }), {
      status: 404,
    });
  }

  return reportDetail;
}

export default function DetailLaporan({ loaderData }: Route.ComponentProps) {
  return <GovDetailLaporan report={loaderData} />;
}
