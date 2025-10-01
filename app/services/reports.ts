import type { ReportsResponse } from '~/types';

interface GetReportsParams {
  limit?: number | string;
  cursor?: number | string;
}

/**
 * Ambil daftar reports dari /api/reports (same-origin).
 */
async function getReports(
  params: GetReportsParams,
  request?: Request,
): Promise<ReportsResponse> {
  const origin = request ? new URL(request.url).origin : '';
  const url = new URL('/api/reports', origin);

  // Pasang query params
  if (params.limit != null) url.searchParams.set('limit', String(params.limit));
  if (params.cursor != null && params.cursor !== '')
    url.searchParams.set('cursor', String(params.cursor));

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    // Biarkan caller (loader) yang fallback bila gagal
    throw new Error(`GET /api/reports failed: ${res.status} ${res.statusText}`);
  }

  // Parse aman untuk JSON
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Unexpected content-type: ${ct}. Body: ${text}`);
  }

  const data = (await res.json()) as ReportsResponse;
  // (opsional) validasi minimum
  if (!data || !Array.isArray(data.data)) {
    throw new Error('Invalid response shape from /api/reports');
  }

  return data;
}

export { type GetReportsParams, getReports };
