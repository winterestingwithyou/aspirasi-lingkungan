import type { ReportsResponse } from '../types/reports';
import { createHttp, type Query } from './http';

export interface GetReportsParams extends Query {
  limit?: number | string;
  cursor?: number | string;
  // nanti bisa diperluas: q?: string; status?: string; category?: string;
}

export async function getReports(
  params: GetReportsParams,
  request?: Request,
): Promise<ReportsResponse> {
  const http = createHttp(request);
  return http.get<ReportsResponse>('/api/reports', { params });
}
