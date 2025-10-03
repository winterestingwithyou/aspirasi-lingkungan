import { Link } from 'react-router';
import { Carousel } from 'react-bootstrap';

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
        {/* Responsive multistep: horizontal on md+, vertical on sm */}
        <div
          className="d-flex flex-column flex-md-row gap-4 justify-content-start align-items-start mt-3"
          style={{ width: '100%' }}
        >
          {/* Step 1 */}
          <div className="text-center" style={{ minWidth: 180 }}>
            <div
              className="mx-auto mb-2"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#198754',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              1
            </div>
            <div className="fw-semibold">Laporan Diterima</div>
            <div className="text-muted small">20 Mei 2025, 10:30 WIB</div>
            <div className="small">
              Laporan telah diterima dan akan segera ditindaklanjuti.
            </div>
          </div>
          {/* Step Connector */}
          <div
            className="d-none d-md-block"
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              background: '#dee2e6',
              borderRadius: 2,
            }}
          ></div>
          <div
            className="d-block d-md-none"
            style={{
              alignSelf: 'center',
              width: 4,
              height: 40,
              background: '#dee2e6',
              borderRadius: 2,
            }}
          ></div>
          {/* Step 2 */}
          <div className="text-center" style={{ minWidth: 180 }}>
            <div
              className="mx-auto mb-2"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#0d6efd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              2
            </div>
            <div className="fw-semibold">Dalam Proses Penanganan</div>
            <div className="text-muted small">21 Mei 2025, 09:15 WIB</div>
            <div className="small">
              Tim DLH sedang menuju lokasi untuk pengecekan.
            </div>
          </div>
          {/* Step Connector */}
          <div
            className="d-none d-md-block"
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              background: '#dee2e6',
              borderRadius: 2,
            }}
          ></div>
          <div
            className="d-block d-md-none"
            style={{
              alignSelf: 'center',
              width: 4,
              height: 40,
              background: '#dee2e6',
              borderRadius: 2,
            }}
          ></div>
          {/* Step 3 */}
          <div className="text-center" style={{ minWidth: 180 }}>
            <div
              className="mx-auto mb-2"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              3
            </div>
            <div className="fw-semibold">Selesai</div>
            <div className="text-muted small">22 Mei 2025, 14:00 WIB</div>
            <div className="small">
              Masalah telah ditangani dan lokasi sudah bersih.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
