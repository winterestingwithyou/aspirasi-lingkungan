import { Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import type { ReportsResponse } from '~/types';

const badge = (s: string) =>
  s === 'PENDING'
    ? 'status-pending'
    : s === 'IN_PROGRESS'
      ? 'status-progress'
      : s === 'COMPLETED'
        ? 'status-completed'
        : 'status-fake';

const statusText = (s: string) =>
  s === 'PENDING'
    ? 'Menunggu Tindakan'
    : s === 'IN_PROGRESS'
      ? 'Sedang Diproses'
      : s === 'COMPLETED'
        ? 'Selesai'
        : 'Laporan Palsu';

export default function GovLaporanPage({ reportsResponse }: { reportsResponse: ReportsResponse }) {
  const { data: reports, nextCursor, limit } = reportsResponse;
  const navigate = useNavigate();
  return (
    <>
      <h2 className="mb-4">Daftar Laporan Masalah</h2>

      <div className="filter-section">
        <div className="row g-3">
          <div className="col-md-4">
            <Form.Label>Pencarian Laporan</Form.Label>
            <div className="input-group">
              <Form.Control placeholder="Cari berdasarkan judul atau lokasi..." />
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search" />
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <Form.Label>Filter Kategori</Form.Label>
            <Form.Select defaultValue="all">
              <option value="all">Semua Kategori</option>
              <option value="sampah">Tumpukan Sampah</option>
              <option value="jalan">Jalan Berlubang</option>
              <option value="pohon">Penebangan Pohon Liar</option>
              <option value="limbah">Pembuangan Limbah</option>
              <option value="banjir">Genangan Air/Banjir</option>
              <option value="lainnya">Lainnya</option>
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Label>Filter Status</Form.Label>
            <Form.Select defaultValue="all">
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Tindakan</option>
              <option value="progress">Sedang Diproses</option>
              <option value="completed">Selesai</option>
              <option value="fake_report">Laporan Palsu</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {reports.map((report) => (
        <div className="report-card" key={report.id}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5>{report.problemType?.name || 'Laporan'} #{report.id}</h5>
              <p className="text-muted mb-2">
                <i className="bi bi-geo-alt-fill me-1" /> {report.location || 'Lokasi tidak ada'}
              </p>
              <p className="mb-2">{report.description.slice(0, 100)}...</p>
              <span className={`report-status ${badge(report.status)}`}>
                {statusText(report.status)}
              </span>
            </div>
            <div className="text-end">
              <small className="text-muted">{new Date(report.createdAt).toLocaleDateString('id-ID')}</small>
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
      {reports.length === 0 && <div className="text-center text-muted py-5">Tidak ada laporan.</div>}

      <nav aria-label="Page navigation" className="mt-4">
        <Pagination className="justify-content-center">
          <Pagination.Prev disabled>Sebelumnya</Pagination.Prev>
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Next
            disabled={!nextCursor}
            onClick={() => {
              if (nextCursor) navigate(`?limit=${limit}&cursor=${nextCursor}`);
            }}
          >
            Selanjutnya
          </Pagination.Next>
        </Pagination>
      </nav>
    </>
  );
}
