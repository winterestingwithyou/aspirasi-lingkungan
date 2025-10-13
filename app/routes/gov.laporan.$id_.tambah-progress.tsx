import type { Route } from './+types/gov.laporan.$id_.tambah-progress';
import GovTambahProgress from '~/pages/gov/gov-tambah-progress';
import {
  addReportProgress,
  getAllowedNextStatuses,
  getReportState,
} from '~/server/model/reportProgress';
import { redirect } from 'react-router';
import { reportProgressServerSchema } from '~/validators/report-progress';

function meta({ params }: Route.MetaArgs) {
  return [
    {
      title: `Tambah Progress Laporan #${params.id} - Eco Rapid`,
    },
    { name: 'description', content: 'Tambah progress penanganan laporan.' },
  ];
}

async function loader({ context, params }: Route.LoaderArgs) {
  const reportId = Number(params.id);
  if (isNaN(reportId)) {
    throw new Response('ID tidak valid', { status: 400 });
  }

  const state = await getReportState(
    context.cloudflare.env.DATABASE_URL,
    reportId,
  );
  if (!state) {
    throw new Response('Laporan tidak ditemukan', { status: 404 });
  }

  const allowedNext = getAllowedNextStatuses(state.status);
  return {
    reportId,
    currentStatus: state.status,
    allowedNext,
    isFakeReport: state.isFakeReport ?? false,
  };
}

async function action({ request, params, context }: Route.ActionArgs) {
  const form = await request.formData();
  const reportId = Number(params.id);
  if (!Number.isFinite(reportId)) {
    return {
      ok: false as const,
      message: 'ID laporan tidak valid.',
    };
  }

  const parsed = reportProgressServerSchema.safeParse({
    phase: form.get('phase'),
    status: form.get('status'),
    description: form.get('description'),
    progressPhotoUrl: form.get('progressPhotoUrl'),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const fieldErrors: Record<string, string> = {};
    for (const [key, value] of Object.entries(flattened)) {
      if (value?.length) {
        fieldErrors[key] = value[0];
      }
    }
    if (
      typeof fieldErrors.status === 'string' &&
      fieldErrors.status.toLowerCase().includes('invalid enum value')
    ) {
      fieldErrors.status = 'Status progress wajib dipilih';
    }
    return {
      ok: false as const,
      message: 'Periksa kembali isian Anda.',
      fieldErrors,
    };
  }

  try {
    await addReportProgress(context.cloudflare.env.DATABASE_URL, reportId, {
      phase: parsed.data.phase,
      status: parsed.data.status,
      description: parsed.data.description,
      progressPhotoUrl: parsed.data.progressPhotoUrl,
    });

    // Kembali ke halaman detail laporan
    return redirect(`/gov/laporan/${reportId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);

    return {
      ok: false as const,
      message: e?.message ?? 'Gagal menyimpan progress',
    };
  }
}

// eslint-disable-next-line no-empty-pattern
function Page({}: Route.ComponentProps) {
  return <GovTambahProgress />;
}

export { meta, loader, action, Page as default };
