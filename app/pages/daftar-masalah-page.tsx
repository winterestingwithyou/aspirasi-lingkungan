import { useMemo } from 'react';
import { useLoaderData, useLocation } from 'react-router';
import { Card, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import type { Report, ReportsResponse } from '~/types';
import { formatTanggal } from '~/helper/date';
import { badge, statusText } from '~/helper/report-status';

function DaftarMasalahPage() {
  const { data, nextCursor } = useLoaderData() as ReportsResponse;
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const hasNextPage = !!nextCursor;

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
              <Card as="a" href={`/daftar-masalah/${r.key}`} className="report-list-card text-decoration-none h-100" onClick={(e) => { e.preventDefault(); navigate(`/daftar-masalah/${r.key}`); }}>
                <Card.Img variant="top" src={r.img} alt={r.title} className="report-list-card-img" />
                <Card.Body className="d-flex flex-column">
                  <Card.Title as="h5" className="mb-2">{r.title}</Card.Title>
                  <Card.Text className="text-muted mb-2 small">
                    <i className="bi bi-geo-alt-fill me-1" /> {r.loc}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div>
                      <span className={`report-status ${badge(r.status)}`}>
                        {statusText(r.status)}
                      </span>
                    </div>
                    <small className="text-muted">{r.date}</small>
                  </div>
                </Card.Body>
              </Card>
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
            <Pagination.Prev
              disabled={currentPage <= 1}
              onClick={() => {
                if (currentPage > 1) navigate(`?page=${currentPage - 1}`);
              }}
            >
              Sebelumnya
            </Pagination.Prev>
            <Pagination.Item active>{currentPage}</Pagination.Item>

            <Pagination.Next
              disabled={!hasNextPage}
              onClick={() => {
                if (hasNextPage) navigate(`?page=${currentPage + 1}`);
              }}
            >
              Selanjutnya
            </Pagination.Next>
          </Pagination>
        </nav>
      </Container>
    </section>
  );
}

export { DaftarMasalahPage };
