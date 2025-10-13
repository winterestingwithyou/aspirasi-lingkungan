import GovJenisMasalah from '~/pages/gov/gov-jenis-masalah';
import type { Route } from './+types/gov.jenis-masalah';
import { createProblemType, deleteProblemType, listProblemTypes, updateProblemType } from '~/server/model/problem-types';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Jenis Masalah - Eco Rapid' },
    {
      name: 'description',
      content: 'Halaman untuk kelola jenis masalah.',
    },
  ];
}

export type GovJenisMasalahLoaderData = Awaited<ReturnType<typeof loader>>;

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const problemTypes = await listProblemTypes(context.cloudflare.env.DATABASE_URL, true);
    return { problemTypes, error: null };
  } catch (e) {
    console.error('Error loading problem types:', e);
    return { problemTypes: [], error: 'Gagal memuat jenis masalah.' };
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const dbUrl = context.cloudflare.env.DATABASE_URL;
  const form = await request.formData();
  const action = form.get('_action');

  try {
    if (action === 'create') {
      const name = form.get('name') as string;
      const description = form.get('description') as string;
      if (!name) return { status: 400, error: 'Nama jenis masalah tidak boleh kosong.' };
      await createProblemType(dbUrl, { name, description: description || null });
      return { status: 200, data: 'Berhasil dibuat' };
    }

    if (action === 'update') {
      const id = Number(form.get('id'));
      const name = form.get('name') as string;
      const description = form.get('description') as string;
      if (isNaN(id)) return { status: 400, error: 'ID tidak valid.' };
      if (!name) return { status: 400, error: 'Nama jenis masalah tidak boleh kosong.' };
      await updateProblemType(dbUrl, id, { name, description: description || null });
      return { status: 200, data: 'Berhasil diperbarui' };
    }

    if (action === 'delete') {
      const id = Number(form.get('id'));
      if (isNaN(id)) return { status: 400, error: 'ID tidak valid.' };
      await deleteProblemType(dbUrl, id);
      return { status: 200, data: 'Berhasil dihapus' };
    }

    return { status: 400, error: 'Aksi tidak dikenal.' };
  } catch (err: any) {
    console.error(`Failed to ${action} problem type:`, err);
    return {
      status: 500,
      error: err.message || `Gagal ${action} jenis masalah.`,
    };
  }
}

export default function JenisMasalah({ loaderData }: Route.ComponentProps) {
  if (loaderData.error) {
    return <div className="alert alert-danger">{loaderData.error}</div>;
  }
  return <GovJenisMasalah problemTypes={loaderData.problemTypes} />;
}
