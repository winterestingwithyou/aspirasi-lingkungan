import { useState } from 'react';
import { Form, Pagination } from 'react-bootstrap';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router';
import { badge, statusText } from '~/helper/report-status';
import type { ProblemType, ReportsResponse } from '~/types';
import { ReportStatus } from '~/prisma-enums';

export default function GovLaporanPage() {
  const { reports: reportsPayload, problemTypes } = useLoaderData<{
    reports: ReportsResponse;
    problemTypes: ProblemType[];
  }>();
  const { data: reports, nextCursor, limit } = reportsPayload;

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // State untuk filter
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(
    searchParams.get('category') || 'all',
  );
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  // Fungsi untuk menangani perubahan filter dan navigasi
  const handleFilterChange = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);
    if (status !== 'all') params.set('status', status);
    // Hapus page saat filter berubah untuk kembali ke halaman 1
    navigate(`?${params.toString()}`);
  };

  return (
    <>
      <h2 className="mb-4">Daftar Laporan Masalah</h2>

      <Form
        className="filter-section"
        onSubmit={(e) => {
          e.preventDefault();
          handleFilterChange();
        }}
      >
        <div className="row g-3">
          <div className="col-md-4">
            <Form.Label>Pencarian Laporan</Form.Label>
            <div className="input-group input-group-sm">
              <Form.Control
                placeholder="Cari berdasarkan judul atau lokasi..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <i className="bi bi-search" />
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <Form.Label>Filter Kategori</Form.Label>
            <Form.Select
              size="sm"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const params = new URLSearchParams(location.search);
                if (e.target.value === 'all') params.delete('category');
                else params.set('category', e.target.value);
                params.delete('page'); // Reset ke halaman 1
                navigate(`?${params.toString()}`);
              }}
            >
              <option value="all">Semua Kategori</option>
              {problemTypes.map((pt) => (
                <option key={pt.id} value={String(pt.id)}>
                  {pt.name}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Label>Filter Status</Form.Label>
            <Form.Select
              size="sm"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                const params = new URLSearchParams(location.search);
                if (e.target.value === 'all') params.delete('status');
                else params.set('status', e.target.value);
                params.delete('page'); // Reset ke halaman 1
                navigate(`?${params.toString()}`);
              }}
            >
              <option value="all">Semua Status</option>
              <option value={ReportStatus.PENDING}>Menunggu Tindakan</option>
              <option value={ReportStatus.IN_PROGRESS}>Sedang Diproses</option>
              <option value={ReportStatus.COMPLETED}>Selesai</option>
              <option value={ReportStatus.FAKE_REPORT}>Laporan Palsu</option>
            </Form.Select>
          </div>
        </div>
      </Form>

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
                <Link
                  className="btn btn-sm btn-outline-primary"
                  to={`/gov/laporan/${report.id}`}
                >
                  Detail
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      {reports.length === 0 && (
        <div className="text-center text-muted py-5">Tidak ada laporan.</div>
      )}

      <nav aria-label="Page navigation" className="mt-4">
        <Pagination className="justify-content-center">
          <Pagination.Prev
            disabled={currentPage <= 1}
            onClick={() => {
              if (currentPage > 1) {
                searchParams.set('page', String(currentPage - 1));
                navigate(`?${searchParams.toString()}`);
              }
            }}
          >
            Sebelumnya
          </Pagination.Prev>
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Next
            disabled={!nextCursor || reports.length < limit}
            onClick={() => {
              if (nextCursor && reports.length >= limit) {
                searchParams.set('page', String(currentPage + 1));
                navigate(`?${searchParams.toString()}`);
              }
            }}
          >
            Selanjutnya
          </Pagination.Next>
        </Pagination>
      </nav>
    </>
  );
}
