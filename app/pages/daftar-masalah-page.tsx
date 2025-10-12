import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useLocation } from 'react-router';
import { Card, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import type { ProblemType, Report, ReportsResponse } from '~/types';
import { formatTanggal } from '~/helper/date';
import { badge, statusText } from '~/helper/report-status';
import { ReportStatus } from '~/generated/prisma/client';

function DaftarMasalahPage() {
  const { reports, problemTypes } = useLoaderData() as {
    reports: ReportsResponse;
    problemTypes: ProblemType[];
  };
  const { data, nextCursor } = reports;
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const hasNextPage = !!nextCursor;

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

        <Form
          className="filter-section"
          onSubmit={(e) => {
            e.preventDefault();
            handleFilterChange();
          }}
        >
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Pencarian Masalah</Form.Label>
              <div className="input-group">
                <Form.Control
                  placeholder="Cari berdasarkan judul atau lokasi..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="submit"
                >
                  <i className="bi bi-search" />
                </button>
              </div>
            </Col>
            <Col md={4}>
              <Form.Label>Filter Kategori</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  // Langsung filter saat kategori berubah
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
            </Col>
            <Col md={4}>
              <Form.Label>Filter Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  // Langsung filter saat status berubah
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
              </Form.Select>
            </Col>
          </Row>
        </Form>

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

        {/* Pagination */}
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
              disabled={!hasNextPage}
              onClick={() => {
                if (hasNextPage) {
                  searchParams.set('page', String(currentPage + 1));
                  navigate(`?${searchParams.toString()}`);
                }
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
