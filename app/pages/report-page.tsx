import { useRef, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";

export default function ReportPage() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [mapText, setMapText] = useState<string>("Peta akan ditampilkan di sini setelah lokasi ditentukan");
  const successRef = useRef<HTMLDivElement | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgUrl(String(ev.target?.result || ""));
    reader.readAsDataURL(f);
  };

  const onGeo = () => {
    if (!navigator.geolocation) return alert("Geolocation tidak didukung browser Anda.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        setMapText(`Lokasi berhasil ditentukan • Lat: ${lat}, Long: ${lon}`);
        (document.getElementById("problem-location") as HTMLInputElement).value = `Lat: ${lat}, Long: ${lon}`;
      },
      (err) => alert("Gagal mengambil lokasi: " + err.message)
    );
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    e.currentTarget.reset();
    setImgUrl(null);
    setMapText("Peta akan ditampilkan di sini setelah lokasi ditentukan");
  };

  return (
    <section className="page-section">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Form Pelaporan Masalah</h2>
          <p className="lead">Laporkan masalah lingkungan yang Anda temukan</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="form-container">
              <Form onSubmit={onSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nama Pelapor</Form.Label>
                      <Form.Control required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nomor Identitas (NIK, dsb)</Form.Label>
                      <Form.Control required />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Jenis Masalah</Form.Label>
                      <Form.Select required defaultValue="">
                        <option value="" disabled>Pilih jenis masalah</option>
                        <option value="sampah">Tumpukan Sampah</option>
                        <option value="jalan">Jalan Berlubang</option>
                        <option value="pohon">Penebangan Pohon Liar</option>
                        <option value="limbah">Pembuangan Limbah</option>
                        <option value="banjir">Genangan Air/Banjir</option>
                        <option value="lainnya">Lainnya</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Foto Masalah</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={onFile} required />
                      {imgUrl && <img src={imgUrl} className="image-preview d-block" alt="Preview" />}
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Deskripsi Masalah</Form.Label>
                      <Form.Control as="textarea" rows={4} placeholder="Jelaskan secara detail..." required />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Lokasi</Form.Label>
                      <div className="input-group">
                        <Form.Control id="problem-location" placeholder="Masukkan alamat atau klik tombol di bawah" required />
                        <Button variant="outline-secondary" type="button" onClick={onGeo}>
                          <i className="bi bi-geo-alt-fill me-2" />Ambil Lokasi
                        </Button>
                      </div>
                      <div className="map-container"><p className="text-muted mb-0">{mapText}</p></div>
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="text-center mt-4">
                    <Button type="submit" size="lg">Kirim Laporan</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Laporan Berhasil Dikirim!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-3">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }} />
          </div>
          <p>Terima kasih telah melaporkan masalah lingkungan. Laporan Anda akan segera kami tindak lanjuti.</p>
          <p>Nomor laporan Anda: <strong>#ENV2023000123</strong></p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button onClick={() => setShowSuccess(false)}>OK</Button>
          <Button variant="outline-primary" href="/daftar-masalah" onClick={() => setShowSuccess(false)}>Lihat Daftar Masalah</Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
