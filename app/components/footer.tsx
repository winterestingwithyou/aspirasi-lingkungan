import { Button, Col, Container, Form, Row } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="footer-dark mt-5">
      <Container>
        <Row>
          <Col lg={4} className="mb-4">
            <h5>About Platform</h5>
            <p>
              Platform pelaporan masalah lingkungan yang menghubungkan
              masyarakat dengan pemerintah untuk menciptakan lingkungan yang
              lebih bersih dan sehat.
            </p>
            <div className="social-icons mt-3">
              <a href="#">
                <i className="bi bi-facebook" />
              </a>
              <a href="#">
                <i className="bi bi-twitter" />
              </a>
              <a href="#">
                <i className="bi bi-instagram" />
              </a>
              <a href="#">
                <i className="bi bi-youtube" />
              </a>
            </div>
          </Col>
          <Col lg={2} md={6} className="mb-4">
            <h5>Navigasi Cepat</h5>
            <ul className="footer-links">
              <li>
                <a href="/">Beranda</a>
              </li>
              <li>
                <a href="/laporkan">Laporkan</a>
              </li>
              <li>
                <a href="/daftar-masalah">Daftar Masalah</a>
              </li>
              <li>
                <a href="/tentang-kami">Tentang Kami</a>
              </li>
              <li>
                <a href="/kontak">Kontak</a>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Hubungi Kami</h5>
            <ul className="footer-links">
              <li>
                <i className="bi bi-geo-alt me-2" /> Jl. Masjid Al-Ghazali, Bukit Lama, Kec. Ilir Bar. I, Kota Palembang, Sumatera Selatan 30128
              </li>
              <li>
                <i className="bi bi-telephone me-2" /> (+62) 852-1195-1640
              </li>
              <li>
                <i className="bi bi-envelope me-2" /> eco.rapid@gmail.com
              </li>
            </ul>
          </Col>
          <Col lg={3} className="mb-4">
            <h5>Jadilah Pahlawan Lingkungan</h5>
            <p>
              Lihat masalah di sekitar Anda? Jangan diam saja. Laporkan sekarang
              dan bantu kami mengambil tindakan.
            </p>
            <Button href="/laporkan" variant="success" className="w-100 mt-2">
              <i className="bi bi-megaphone-fill me-2" /> Laporkan Masalah
            </Button>
          </Col>
        </Row>
        <div className="copyright">
          <p>
            &copy; 2025 Platform Pelaporan Masalah Lingkungan. Hak Cipta
            Dilindungi.
          </p>
        </div>
      </Container>
    </footer>
  );
}
