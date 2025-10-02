import type { ApiError } from './api';

// Status enum dari backend
type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

// Relasi problem type sederhana
interface ProblemType {
  id: number;
  name: string;
}

// Relasi progress update
interface ReportProgress {
  id: number;
  status: ReportStatus;
  note: string | null;
  createdAt: string; // ISO string
  reportId: number;
}

// Bentuk report seperti di-return backend /api/reports
interface Report {
  id: number;
  reporterName: string;
  reporterContact?: string | null;
  description: string;
  photoUrl: string;
  latitude: string; // Prisma Decimal -> dikirim sebagai string
  longitude: string; // Prisma Decimal -> dikirim sebagai string
  location?: string | null;
  status: ReportStatus;
  upvoteCount: number;
  isFakeReport: boolean;
  createdAt: string; // ISO string
  resolvedAt?: string | null;
  deletedAt?: string | null;

  problemType: ProblemType;
  progressUpdates: ReportProgress[];
}

// Bentuk response dari endpoint /api/reports
interface ReportsResponse {
  data: Report[];
  nextCursor: number | null;
  limit: number;
}

type CreateReportResponse =
  | { message: string; data: Report } // sukses
  | ApiError; // gagal

export type {
  Report,
  ReportsResponse,
  CreateReportResponse,
  ReportStatus,
  ProblemType,
  ReportProgress,
};
