import { verifyTurnstile } from '~/server/lib/tunstile';
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
    { title: 'Form Pelaporan Masalah - Eco Rapid' },
    {
      name: 'description',
      content: 'Laporkan masalah lingkungan yang Anda temukan.',
    },
  ];
}

async function action({ request, context }: Route.ActionArgs) {
  const form = await request.formData();

  const token =
    (form.get('cf-turnstile-response') as string | null) ||
    (await request
      .json<{ 'cf-turnstile-response'?: string }>()
      ?.then((j) => j['cf-turnstile-response'] ?? null)
      .catch(() => null));

  if (!token) {
    return { status: 400, error: 'Captcha tidak ditemukan' };
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? undefined;
  const { success, ['error-codes']: codes } = await verifyTurnstile(
    context.cloudflare.env.TURNSTILE_SECRET_KEY,
    token,
    ip,
  );

  if (!success) {
    return {
      status: 400,
      error: 'Verifikasi captcha gagal',
      details: codes,
    };
  }

  // Ambil semua field dari FormData
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
      status: 400,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  const data: CreateReportPayload = parsed.data;

  try {
    const created = await createReport(
      context.cloudflare.env.DATABASE_URL,
      data,
    );
    return { status: 200, data: created };
  } catch (err) {
    console.error('Gagal menyimpan laporan:', err);
    return {
      status: 500,
      error: 'Gagal menyimpan laporan ke database.',
    };
  }
}

async function loader({ context }: Route.LoaderArgs) {
  const siteKey = context.cloudflare.env.TURNSTILE_SITE_KEY;

  try {
    const problemTypes = await listProblemTypes(
      context.cloudflare.env.DATABASE_URL,
    );
    return { problemTypes, ptError: null, siteKey };
  } catch (e) {
    console.error('Error loading problem types:', e);
    return { problemTypes: [], ptError: 'Gagal memuat jenis masalah', siteKey };
  }
}

function Report({ loaderData }: Route.ComponentProps) {
  return (
    <ReportPage
      problemTypes={loaderData.problemTypes}
      ptError={loaderData.ptError}
      siteKey={loaderData.siteKey}
    />
  );
}

export default Report;
export { action, loader, meta };
