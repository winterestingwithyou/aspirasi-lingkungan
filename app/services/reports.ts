import type { ReportsResponse, ReportStatsResponse } from '~/types';

type GetReportsParams = Record<string, string | number | undefined | null>;

/**
 * Ambil daftar reports dari /api/reports (same-origin).
 */
async function getReports(
  params: GetReportsParams,
  request?: Request,
): Promise<ReportsResponse> {
  const origin = request ? new URL(request.url).origin : '';
  const url = new URL('/api/reports', origin);

  // Secara dinamis menambahkan semua parameter yang valid ke URL
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

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

async function getReportStats(request: Request): Promise<ReportStatsResponse> {
  const apiUrl = getApiUrl('/api/reports/stats', request);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Gagal mengambil statistik');
  return res.json();
}

export { type GetReportsParams, getReports, getReportStats };
