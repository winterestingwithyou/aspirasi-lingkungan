import type { Prisma } from '~/generated/prisma/client';
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

type ReportDetail = Prisma.ReportGetPayload<{
  include: {
    problemType: true;
    progressUpdates: {
      include: {
        user: {
          select: { id: true; username: true; email: true };
        };
      };
    };
  };
}>;

interface ReportStats {
  all?: number;
  today?: number;
  pending?: number;
  inProgress?: number;
  completed?: number;
}

export type {
  Report,
  ReportsResponse,
  CreateReportResponse,
  ReportStatus,
  ProblemType,
  ReportProgress,
  ReportDetail,
  ReportStats,
};
