import { useMemo } from 'react';
import { Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import { Link } from 'react-router';
import type { Report, ReportsResponse } from '~/types';

const badge = (s: string) =>
  s === 'PENDING'
    ? 'report-status status-pending'
    : s === 'IN_PROGRESS' || s === 'PROGRESS' || s === 'progress'
      ? 'report-status status-progress'
      : 'report-status status-completed';

// Format tanggal sederhana (ID)
function formatTanggal(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function DaftarMasalahPage({ message }: { message: ReportsResponse }) {
  const { data, nextCursor, limit } = message;

  // Map data API → tampilan kartu (fallback jika field null)
  const items = useMemo(
    () =>
      data.map((r: Report) => ({
        key: r.id,
        img:
          r.photoUrl ||
          'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
        title:
          r.problemType?.name ||
          (r.description?.slice(0, 70) || 'Laporan') +
            (r.description?.length > 70 ? '…' : ''),
        loc: r.location || 'Lokasi tidak tersedia',
        status: r.status || 'PENDING',
        date: formatTanggal(r.createdAt),
      })),
    [data],
  );

  return (
    <section className="page-section">
      <Container>
        <div className="text-center mb-4 mt-3">
          <h2 className="section-title">Daftar Masalah</h2>
          <p className="lead">
            Lihat semua masalah lingkungan yang telah dilaporkan
          </p>
        </div>

        <div className="filter-section">
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Pencarian Masalah</Form.Label>
              {/* Untuk penyaringan berbasis URL, kamu bisa ubah ke <form method="get"> dan pakai name="q" */}
              <div className="input-group">
                <Form.Control placeholder="Cari berdasarkan judul atau lokasi..." />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="bi bi-search" />
                </button>
              </div>
            </Col>
            <Col md={4}>
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
            </Col>
            <Col md={4}>
              <Form.Label>Filter Status</Form.Label>
              <Form.Select defaultValue="all">
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Tindakan</option>
                <option value="progress">Sedang Diproses</option>
                <option value="completed">Selesai</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        <Row className="g-4 mt-1">
          {items.map((r) => (
            <Col md={6} lg={4} key={r.key}>
              <div className="report-list-card">
                <img src={r.img} alt={r.title} />
                <div className="report-list-card-body">
                  <h5>{r.title}</h5>
                  <p className="text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-1" /> {r.loc}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={badge(r.status)}>
                      {r.status === 'IN_PROGRESS'
                        ? 'Sedang Diproses'
                        : r.status === 'PENDING'
                          ? 'Menunggu Tindakan'
                          : 'Selesai'}
                    </span>
                    <small className="text-muted">{r.date}</small>
                  </div>
                </div>
              </div>
            </Col>
          ))}

          {items.length === 0 && (
            <Col xs={12}>
              <div className="text-center text-muted py-5">
                Belum ada laporan.
              </div>
            </Col>
          )}
        </Row>

        {/* Cursor-based pagination: tombol Next saja (Prev butuh state stack cursor) */}
        <nav aria-label="Page navigation" className="mt-4">
          <Pagination className="justify-content-center">
            <Pagination.Prev disabled>Sebelumnya</Pagination.Prev>
            <Pagination.Item active>1</Pagination.Item>
            {nextCursor ? (
              <Link to={`?limit=${limit}&cursor=${nextCursor}`}>
                <Pagination.Next>Selanjutnya</Pagination.Next>
              </Link>
            ) : (
              <Pagination.Next disabled>Selanjutnya</Pagination.Next>
            )}
          </Pagination>
        </nav>
      </Container>
    </section>
  );
}

export { DaftarMasalahPage };
