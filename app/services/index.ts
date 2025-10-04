import type {
  ProblemType,
  ReportsResponse,
  ReportStatsResponse,
  ProblemTypesResponse,
} from '~/types';

/**
 * Fungsi helper untuk memastikan URL API benar, baik di production maupun development.
 * Di development, Remix berjalan di port berbeda dari Cloudflare Workers,
 * jadi kita perlu hardcode URL worker.
 */
function getApiUrl(path: string, request?: Request): string {
  // Jika request ada, gunakan origin-nya. Jika tidak, asumsikan relative path.
  // Proxy di remix.config.js akan menangani ini di development.
  const origin = request ? new URL(request.url).origin : '';
  return `${origin}${path}`;
}

export async function getReports(
  params: { limit: string; cursor: string },
  request: Request,
): Promise<ReportsResponse> {
  const apiUrl = getApiUrl('/api/reports', request);
  const url = new URL(apiUrl);
  url.searchParams.set('limit', params.limit);
  if (params.cursor) url.searchParams.set('cursor', params.cursor);

  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil laporan');
  return res.json();
}

export async function getReportStats(
  request: Request,
): Promise<ReportStatsResponse> {
  const apiUrl = getApiUrl('/api/reports/stats', request);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Gagal mengambil statistik');
  return res.json();
}

export async function getProblemTypes(
  request: Request,
): Promise<ProblemType[]> {
  const apiUrl = getApiUrl('/api/problem-types', request);
  const res = await fetch(apiUrl);
  const payload: ProblemTypesResponse = await res.json();
  if (!res.ok) {
    throw new Error(payload?.error || 'Gagal memuat jenis masalah');
  }
  return payload.data ?? [];
}