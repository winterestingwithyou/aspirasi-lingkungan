import { Button, Card, Col, Container, Row } from 'react-bootstrap';

export default function LandingPage() {
  return (
    <>
      <section className="hero-section text-white text-center">
        <Container>
          <h1>Selamat Datang di ECO-RAPID <br></br>Platform Pelaporan Masalah Lingkungan</h1>
          <p>
            Platform pelaporan masalah lingkungan yang menghubungkan masyarakat
            dengan pemerintah untuk menciptakan lingkungan yang lebih bersih, aman dan
            sehat.
          </p>
          <Button href="/laporkan" size="lg">
            Laporkan Masalah
          </Button>
        </Container>
      </section>

      <section className="page-section">
        <Container>
          <div className="text-center mb-5 mt-3">
            <h2 className="section-title">Cara Melaporkan Masalah</h2>
            <p className="lead">
              Ikuti langkah-langkah sederhana untuk melaporkan masalah
              lingkungan di sekitar Anda
            </p>
          </div>
          <Row className="g-4">
            {[
              {
                icon: 'bi-clipboard2-check-fill',
                title: 'Isi Formulir',
                desc: 'Lengkapi formulir pelaporan dengan data diri, jenis masalah, lokasi, dan lampirkan foto sebagai bukti.',
              },
              {
                icon: 'bi-send-fill',
                title: 'Kirim Laporan',
                desc: 'Kirim laporan Anda dan dapatkan nomor tiket untuk memantau status penanganan masalah.',
              },
              {
                icon: 'bi-check-circle-fill',
                title: 'Pantau Progress',
                desc: 'Pantau status penyelesaian masalah secara real-time melalui halaman Daftar Masalah.',
              },
            ].map((s, i) => (
              <Col md={4} key={i}>
                <div className="guide-step text-center">
                  <div className="guide-step-icon">
                    <i className={`bi ${s.icon}`} />
                  </div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="page-section bg-light mt-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="section-title">Statistik Pelaporan</h2>
            <p className="lead">Dampak nyata dari partisipasi masyarakat</p>
          </div>
          <Row className="g-4">
            {[
              { n: 34, label: 'Total Laporan' },
              { n: 10, label: 'Menunggu Tindakan' },
              { n: 16, label: 'Dalam Proses' },
              { n: 8, label: 'Terselesaikan' },
            ].map((x, i) => (
              <Col md={3} xs={6} key={i}>
                <Card className="stats-card">
                  <Card.Body className="text-center">
                    <div className="stats-number">{x.n}</div>
                    <p className="mb-0">{x.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
