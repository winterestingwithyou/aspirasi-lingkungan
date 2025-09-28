import { Link } from 'react-router';
import { Carousel } from 'react-bootstrap';

export default function GovDetailLaporan() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detail Laporan Masalah</h2>
        <Link className="btn btn-primary" to="/gov/laporan">
          <i className="bi bi-exclamation-triangle me-1" /> Tandai sebagai Palsu
        </Link>
        <Link className="btn btn-primary" to="/gov/laporan/1/edit">
          <i className="bi bi-pencil-square me-1" /> Edit Laporan
        </Link>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100 detail-image"
                src="https://png.pngtree.com/thumb_back/fh260/background/20241008/pngtree-breathtaking-panoramic-view-of-a-summer-landscape-featuring-majestic-waterfalls-charming-image_16334134.jpg"
                alt="Foto Pelapor"
              />
              <Carousel.Caption>
                <strong>Foto Pelapor</strong>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 detail-image"
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Sedang Ditangani"
              />
              <Carousel.Caption>
                <strong>Sedang Ditangani</strong>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 detail-image"
                src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca"
                alt="Selesai"
              />
              <Carousel.Caption>
                <strong>Selesai</strong>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <h5>Informasi Pelapor</h5>
            <p>
              <strong>Nama:</strong> Robin
            </p>
            <p>
              <strong>Kontak:</strong> robin@email.com
            </p>
          </div>
          <div className="mb-3">
            <h5>Informasi Masalah</h5>
            <p>
              <strong>Jenis Masalah:</strong> Tumpukan Sampah
            </p>
            <p>
              <strong>Lokasi:</strong> Jalan Lunjuk
            </p>
            <p>
              <strong>Tanggal Laporan:</strong> 20 Mei 2025
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="report-status status-progress">
                Sedang Diproses
              </span>
            </p>
          </div>
          <div className="mb-3">
            <h5>Deskripsi Masalah</h5>
            <p>Tumpukan sampah sudah lebih dari seminggu tidak diangkut...</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h5>Riwayat Penanganan</h5>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-marker bg-success"></div>
            <div className="timeline-content">
              <h6>Laporan Diterima</h6>
              <p className="text-muted">20 Mei 2025, 10:30 WIB</p>
              <p>Laporan telah diterima dan akan segera ditindaklanjuti.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker bg-primary"></div>
            <div className="timeline-content">
              <h6>Dalam Proses Penanganan</h6>
              <p className="text-muted">21 Mei 2025, 09:15 WIB</p>
              <p>Tim DLH sedang menuju lokasi untuk pengecekan.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
