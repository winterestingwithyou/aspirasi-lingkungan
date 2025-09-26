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
                <a href="#">Tentang Kami</a>
              </li>
              <li>
                <a href="#">Kontak</a>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Hubungi Kami</h5>
            <ul className="footer-links">
              <li>
                <i className="bi bi-geo-alt me-2" /> Jl. Srijaya Negara
              </li>
              <li>
                <i className="bi bi-telephone me-2" /> (021) 1234-5678
              </li>
              <li>
                <i className="bi bi-envelope me-2" /> info@bertindaksegereee.id
              </li>
            </ul>
          </Col>
          <Col lg={3} className="mb-4">
            <h5>Newsletter</h5>
            <p>Daftar untuk mendapatkan update terbaru tentang lingkungan</p>
            <Form className="mt-3">
              <div className="input-group">
                <Form.Control type="email" placeholder="Email Anda" />
                <Button>Daftar</Button>
              </div>
            </Form>
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
