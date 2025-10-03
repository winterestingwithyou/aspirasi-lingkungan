import type { ProblemType, ProblemTypesResponse } from '~/types';

async function getProblemTypes(request?: Request): Promise<ProblemType[]> {
  const origin = request ? new URL(request.url).origin : '';
  const url = new URL('/api/problem-types', origin);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const payload: ProblemTypesResponse = await res.json();

  if (!res.ok) {
    throw new Error(payload?.error || 'Gagal memuat jenis masalah');
  }

  return payload.data ?? [];
}

export { getProblemTypes };
