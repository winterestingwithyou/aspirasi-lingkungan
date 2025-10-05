import type { Route } from './+types/_app.laporkan';
import { ReportPage } from '~/pages/report-page';
import { listProblemTypes } from '~/server/model/problem-types';
import { createReport } from '~/server/model/reports';
import {
  createReportSchema,
  type CreateReportPayload,
} from '~/validators/reports';

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

async function action({ request, context }: Route.ActionArgs) {
  const form = await request.formData();

  // Ambil semua field dari FormData (photoUrl akan diisi client SETELAH validasi awal)
  const raw = {
    reporterName: form.get('reporterName'),
    reporterContact: form.get('reporterContact'),
    problemTypeId: form.get('problemTypeId'),
    description: form.get('description'),
    photoUrl: form.get('photoUrl'),
    location: form.get('location'),
    latitude: form.get('latitude'),
    longitude: form.get('longitude'),
  };

  const parsed = createReportSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  const data: CreateReportPayload = parsed.data;

  try {
    const created = await createReport(
      context.cloudflare.env.DATABASE_URL,
      data,
    );
    return { ok: true, data: created };
  } catch (err) {
    console.error('Gagal menyimpan laporan:', err);
    return { ok: false, error: 'Gagal menyimpan laporan ke database.' };
  }
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
export { action, loader, meta };
