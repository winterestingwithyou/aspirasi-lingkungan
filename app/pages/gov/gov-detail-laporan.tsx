import { Link } from 'react-router';
import { Carousel, Col, Row } from 'react-bootstrap';

const carouselStyle: React.CSSProperties = {
  height: '100%',
  minHeight: 300,
  borderRadius: '12px',
  overflow: 'hidden',
};

const imgStyle: React.CSSProperties = {
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  minHeight: 300,
};

export default function GovDetailLaporan() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detail Laporan Masalah</h2>
        {/* Button edit: teks hanya tampil di md ke atas */}
        <Link
          className="btn btn-primary d-flex align-items-center"
          to="/gov/laporan/1/edit"
        >
          <i className="bi bi-pencil-square me-1" />
          <span className="d-none d-md-inline">Edit Laporan</span>
        </Link>
      </div>

      <div className="row align-items-stretch">
        <div className="col-md-6 d-flex" style={{ minHeight: 300 }}>
          <Carousel style={carouselStyle} className="w-100">
            <Carousel.Item>
              <img
                style={imgStyle}
                src="https://png.pngtree.com/thumb_back/fh260/background/20241008/pngtree-breathtaking-panoramic-view-of-a-summer-landscape-featuring-majestic-waterfalls-charming-image_16334134.jpg"
                alt="Foto Pelapor"
              />
              <Carousel.Caption>
                <strong>Foto Pelapor</strong>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                style={imgStyle}
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Sedang Ditangani"
              />
              <Carousel.Caption>
                <strong>Sedang Ditangani</strong>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                style={imgStyle}
                src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca"
                alt="Selesai"
              />
              <Carousel.Caption>
                <strong>Selesai</strong>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div>
            <div className="mb-2">
              <strong>Informasi Pelapor</strong>
              <div>Nama: Robin</div>
              <div>Kontak: robin@email.com</div>
            </div>
            <div className="mb-2">
              <strong>Informasi Masalah</strong>
              <div>Jenis: Tumpukan Sampah</div>
              <div>Lokasi: Jalan Lunjuk</div>
              <div>Tanggal: 20 Mei 2025</div>
              <div>
                Status:{' '}
                <span className="badge bg-primary">Sedang Diproses</span>
              </div>
            </div>
            <div>
              <strong>Deskripsi Masalah</strong>
              <div>
                Tumpukan sampah sudah lebih dari seminggu tidak diangkut...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>Riwayat Penanganan</h5>
        <div className="mt-3 border rounded p-3">
          {/* Header Tabel */}
          <Row className="fw-bold border-bottom pb-2 mb-2 d-none d-md-flex">
            <Col md={3} className="text-center">Status</Col>
            <Col md={6} className="text-center">Deskripsi</Col>
            <Col md={3} className="text-center">Waktu</Col>
          </Row>

          {/* Baris Riwayat 1 */}
          <Row className="py-2 border-bottom">
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#198754',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 16,
                    marginRight: '10px',
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <span className="fw-semibold">Laporan Diterima</span>
              </div>
            </Col>
            <Col md={6} className="small text-center my-auto">Laporan telah diterima dan akan segera ditindaklanjuti.</Col>
            <Col md={3} className="text-muted small text-center my-auto">20 Mei 2025, 10:30 WIB</Col>
          </Row>

          {/* Baris Riwayat 2 */}
          <Row className="py-2 border-bottom">
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#0d6efd',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 16,
                    marginRight: '10px',
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <span className="fw-semibold">Dalam Proses</span>
              </div>
            </Col>
            <Col md={6} className="small text-center my-auto">Tim DLH sedang menuju lokasi untuk pengecekan.</Col>
            <Col md={3} className="text-muted small text-center my-auto">21 Mei 2025, 09:15 WIB</Col>
          </Row>

          {/* Baris Riwayat 3 */}
          <Row className="py-2">
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#6c757d',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 16,
                    marginRight: '10px',
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <span className="fw-semibold">Selesai</span>
              </div>
            </Col>
            <Col md={6} className="small text-center my-auto">Masalah telah ditangani dan lokasi sudah bersih.</Col>
            <Col md={3} className="text-muted small text-center my-auto">22 Mei 2025, 14:00 WIB</Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
