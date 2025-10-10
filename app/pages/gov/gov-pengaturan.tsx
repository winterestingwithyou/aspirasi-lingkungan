import { Button, Card, Col, Form, Row } from 'react-bootstrap';

export default function GovPengaturan() {
  return (
    <>
      <h2 className="mb-4">Pengaturan Akun</h2>

      {/* Kartu untuk Ubah Profil */}
      <Card className="mb-4">
        <Card.Header as="h5">
          <i className="bi bi-person-badge me-2"></i>
          Informasi Profil
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Perbarui informasi profil Anda seperti nama dan foto.
          </Card.Text>
          <Button variant="primary" href="/gov/profil">
            Buka Halaman Profil
          </Button>
        </Card.Body>
      </Card>

      {/* Kartu untuk Keamanan Akun */}
      <Card className="mb-4">
        <Card.Header as="h5">
          <i className="bi bi-shield-lock me-2"></i>
          Keamanan Akun
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Kata Sandi Saat Ini</Form.Label>
                  <Form.Control type="password" placeholder="Masukkan kata sandi Anda saat ini" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>Kata Sandi Baru</Form.Label>
                  <Form.Control type="password" placeholder="Masukkan kata sandi baru" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Konfirmasi Kata Sandi Baru</Form.Label>
                  <Form.Control type="password" placeholder="Ulangi kata sandi baru" />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Ubah Kata Sandi
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Kartu untuk Preferensi Notifikasi */}
      <Card className="mb-4">
        <Card.Header as="h5">
          <i className="bi bi-bell me-2"></i>
          Preferensi Notifikasi
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Check
              type="switch"
              id="email-notification-switch"
              label="Kirim notifikasi email saat ada laporan baru"
              defaultChecked
            />
            <Form.Check
              type="switch"
              id="summary-notification-switch"
              label="Kirim rangkuman laporan mingguan"
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Kartu untuk Hapus Akun */}
      <Card border="danger">
        <Card.Header as="h5" className="text-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Zona Berbahaya
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Menghapus akun Anda adalah tindakan permanen dan tidak dapat diurungkan.
          </Card.Text>
          <Button variant="outline-danger">Hapus Akun Saya</Button>
        </Card.Body>
      </Card>
    </>
  );
}