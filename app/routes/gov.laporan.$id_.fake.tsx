import type { Route } from './+types/gov.laporan.$id_.fake';
import { markReportAsFake } from '~/server/model/reportProgress';

async function action({ request, params, context }: Route.ActionArgs) {
  const reportId = Number(params.id);
  if (isNaN(reportId)) throw new Response('ID tidak valid', { status: 400 });

  const form = await request.formData();
  const reason = String(form.get('reason') ?? '');

  try {
    await markReportAsFake(
      context.cloudflare.env.DATABASE_URL,
      reportId,
      reason,
    );

    return { status: 200 };
  } catch (err) {
    console.error('Gagal menandai laporan palsu: ', err);

    return {
      status: 500,
      error: 'Gagal menyimpan laporan ke database.',
    };
  }
}

export { action };
