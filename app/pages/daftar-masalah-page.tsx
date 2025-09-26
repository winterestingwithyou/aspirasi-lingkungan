import { Col, Container, Form, Pagination, Row } from 'react-bootstrap';

const items = [
  {
    img: 'https://images.unsplash.com/photo-1591946614720-90a583e1912a?q=80&w=1170&auto=format&fit=crop',
    title: 'Tumpukan Sampah di jalan lunjuk',
    loc: 'Jalan Lunjuk, Bukit Lama',
    status: 'progress',
    date: '20 Mei 2025',
  },
  {
    img: 'https://images.unsplash.com/photo-1589556578395-3c37da9b6a49?q=80&w=1170&auto=format&fit=crop',
    title: 'Jalan Berlubang di jalan depan Halte Unsri',
    loc: 'Jl. Srijaya Negara',
    status: 'pending',
    date: '18 Mei 2025',
  },
  {
    img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1170&auto=format&fit=crop',
    title: 'Pembuangan Limbah',
    loc: 'Sungai Musi',
    status: 'completed',
    date: '15 Mei 2025',
  },
  // ...tambahkan lainnya bila perlu
];

const badge = (s: string) =>
  s === 'pending'
    ? 'report-status status-pending'
    : s === 'progress'
      ? 'report-status status-progress'
      : 'report-status status-completed';

export default function DaftarMasalahPage() {
  return (
    <section className="page-section">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Daftar Masalah</h2>
          <p className="lead">
            Lihat semua masalah lingkungan yang telah dilaporkan
          </p>
        </div>

        <div className="filter-section">
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Pencarian Masalah</Form.Label>
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

        <Row className="g-4">
          {items.map((r, i) => (
            <Col md={6} lg={4} key={i}>
              <div className="report-list-card">
                <img src={r.img} alt={r.title} />
                <div className="report-list-card-body">
                  <h5>{r.title}</h5>
                  <p className="text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-1" /> {r.loc}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={badge(r.status)}>
                      {r.status === 'progress'
                        ? 'Sedang Diproses'
                        : r.status === 'pending'
                          ? 'Menunggu Tindakan'
                          : 'Selesai'}
                    </span>
                    <small className="text-muted">{r.date}</small>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <nav aria-label="Page navigation" className="mt-4">
          <Pagination className="justify-content-center">
            <Pagination.Prev disabled>Sebelumnya</Pagination.Prev>
            <Pagination.Item active>1</Pagination.Item>
            <Pagination.Item>2</Pagination.Item>
            <Pagination.Item>3</Pagination.Item>
            <Pagination.Next>Selanjutnya</Pagination.Next>
          </Pagination>
        </nav>
      </Container>
    </section>
  );
}
