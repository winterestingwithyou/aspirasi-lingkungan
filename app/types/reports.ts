import type { ApiError } from './api';

type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAKE_REPORT';

interface ProblemType {
  id: number;
  name: string;
}

interface ReportProgress {
  id: number;
  status: ReportStatus;
  note: string | null;
  createdAt: string; // ISO string
  reportId: number;
}

interface Report {
  id: number;
  reporterName: string;
  reporterContact?: string | null;
  description: string;
  photoUrl: string | null;
  latitude: number;
  longitude: number;
  location?: string | null;
  status: ReportStatus;
  upvoteCount: number;
  isFakeReport: boolean;
  createdAt: string; // ISO string
  resolvedAt?: string | null;
  deletedAt?: string | null;
  problemType: ProblemType;
  progressUpdates?: ReportProgress[];
}

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
