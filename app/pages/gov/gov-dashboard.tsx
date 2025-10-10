import { useLoaderData } from 'react-router';
import { badge, statusText } from '~/helper/report-status';
import type { ReportsResponse, ReportStats } from '~/types';

export default function GovDashboard() {
  const loaderData = useLoaderData<{
    recentReports: ReportsResponse;
    stats: ReportStats;
  }>();
  const reports = loaderData.recentReports?.data ?? [];
  const stats = loaderData.stats;
  return (
    <>
      <div className="welcome-card mb-4">
        <h3>Selamat Datang, Admin!</h3>
        <p>Dashboard Platform Pelaporan Masalah Lingkungan</p>
      </div>

      <div className="today-stats">
        <h4 className="mb-3">Statistik Hari Ini</h4>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="stats-card text-center">
              <div className="stats-number">{stats?.today ?? 0}</div>
              <p>Laporan Masuk Hari Ini</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="stats-card text-center">
              <div className="stats-number">{stats?.todayCompleted ?? 0}</div>
              <p>Laporan Selesai Hari Ini</p>
            </div>
          </div>
        </div>
      </div>

      <div className="today-stats mt-4">
        <h4 className="mb-3">Statistik Berdasarkan Kategori</h4>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="stats-card text-center">
              <div className="stats-number">{stats?.completed ?? 0}</div>
              <p>Terselesaikan</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card text-center">
              <div className="stats-number">{stats?.inProgress ?? 0}</div>
              <p>Dalam Proses</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card text-center">
              <div className="stats-number">{stats?.pending ?? 0}</div>
              <p>Belum Ditindak</p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-4 mb-3">Laporan Terbaru</h4>
      {reports.map((report) => (
        <div className="report-card" key={report.id}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5>
                {report.problemType?.name || 'Laporan'} #{report.id}
              </h5>
              <p className="text-muted mb-2">
                <i className="bi bi-geo-alt-fill me-1" />{' '}
                {report.location || 'Lokasi tidak ada'}
              </p>
              <p className="mb-2">{report.description.slice(0, 100)}...</p>
              <span className={`report-status ${badge(report.status)}`}>
                {statusText(report.status)}
              </span>
            </div>
            <div className="text-end">
              <small className="text-muted">
                {new Date(report.createdAt).toLocaleDateString('id-ID')}
              </small>
              <div className="mt-2">
                <a
                  className="btn btn-sm btn-outline-primary"
                  href={`/gov/laporan/${report.id}`}
                >
                  Detail
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {reports.length === 0 && (
        <div className="report-card text-center text-muted">
          Tidak ada laporan terbaru.
        </div>
      )}
    </>
  );
}
