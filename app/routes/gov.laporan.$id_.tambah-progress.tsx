import type { Route } from './+types/gov.laporan.$id_.tambah-progress';
import GovTambahProgress from '~/pages/gov/gov-tambah-progress';
import {
  addReportProgress,
  getAllowedNextStatuses,
  getReportState,
} from '~/server/model/reportProgress';
import { redirect } from 'react-router';
import type { ReportStatus } from '~/prisma-enums';

function meta({ params }: Route.MetaArgs) {
  return [
    {
      title: `Tambah Progress Laporan #${params.id} - Web Aspirasi Lingkungan`,
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
  const phase = String(form.get('phase') || '');
  const status = String(form.get('status') || '');
  const description = String(form.get('description') || '');
  const progressPhotoUrlRaw = form.get('progressPhotoUrl');
  const progressPhotoUrl =
    typeof progressPhotoUrlRaw === 'string' && progressPhotoUrlRaw.trim()
      ? progressPhotoUrlRaw.trim()
      : null;

  // Validasi sederhana
  const fieldErrors: Record<string, string> = {};
  if (!status) fieldErrors.status = 'Pilih status';
  if (!description || description.trim().length < 5) {
    fieldErrors.description = 'Deskripsi minimal 5 karakter';
  }
  if (Object.keys(fieldErrors).length) {
    return {
      ok: false as const,
      message: 'Periksa kembali isian Anda.',
      fieldErrors,
    };
  }

  try {
    await addReportProgress(context.cloudflare.env.DATABASE_URL, reportId, {
      phase: phase.trim(),
      status: status as ReportStatus,
      description: description.trim(),
      progressPhotoUrl,
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
