import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';

export default function ReportPage() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [mapText, setMapText] = useState<string>(
    'Peta akan ditampilkan di sini setelah lokasi ditentukan',
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newReportId, setNewReportId] = useState<number | null>(null);

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgUrl(String(ev.target?.result || ''));
    reader.readAsDataURL(f);
  };

  const onGeo = () => {
    if (!navigator.geolocation)
      return alert('Geolocation tidak didukung browser Anda.');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const locationString = `Lat: ${lat}, Long: ${lon}`;
        setMapText(`Lokasi berhasil ditentukan • ${locationString}`);

        // Mengisi input yang terlihat dan input tersembunyi
        const locationInput = document.getElementById('problem-location') as HTMLInputElement;
        if (locationInput) locationInput.value = locationString;

        const latInput = document.getElementById('latitude') as HTMLInputElement;
        if (latInput) latInput.value = lat;

        const lonInput = document.getElementById('longitude') as HTMLInputElement;
        if (lonInput) lonInput.value = lon;
      },
      (err) => alert('Gagal mengambil lokasi: ' + err.message),
    );
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // --- PENTING: Proses Upload Gambar ---
    // Di aplikasi nyata, Anda harus mengunggah file ke layanan storage (seperti Cloudflare R2)
    // dan mendapatkan URL-nya kembali. Untuk sekarang, kita gunakan URL placeholder.
    const photoUrl = 'https://via.placeholder.com/800x600.png?text=Contoh+Foto+Laporan';

    const dataToSend = {
      reporterName: formData.get('reporterName'),
      reporterContact: formData.get('reporterContact'),
      problemTypeId: Number(formData.get('problemTypeId')),
      description: formData.get('description'),
      photoUrl: photoUrl, // Gunakan URL hasil upload di sini
      location: formData.get('location'),
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        // Menangkap pesan error dari validasi Zod atau error server lainnya
        const errorMessage = result.error || (result.issues && result.issues.map((i: any) => i.message).join(', ')) || 'Terjadi kesalahan pada server.';
        throw new Error(errorMessage);
      }

      // Jika berhasil
      setNewReportId(result.data.id); // Simpan ID laporan baru dari respons backend
      setShowSuccess(true);
      form.reset();
      setImgUrl(null);
      setMapText('Peta akan ditampilkan di sini setelah lokasi ditentukan');

    } catch (error: any) {
      setSubmitError(error.message || 'Gagal mengirim laporan. Silakan coba lagi.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <Container>
        <div className="text-center mb-5 mt-3">
          <h2 className="section-title">Form Pelaporan Masalah</h2>
          <p className="lead">Laporkan masalah lingkungan yang Anda temukan</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="form-container mt-0">
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              <Form noValidate onSubmit={onSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nama Pelapor</Form.Label>
                      <Form.Control name="reporterName" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nomor Whatsapp</Form.Label>
                      <Form.Control name="reporterContact" required />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Jenis Masalah</Form.Label>
                      <Form.Select name="problemTypeId" required defaultValue="">
                        <option value="" disabled>
                          Pilih jenis masalah
                        </option>
                        {/* Nilai `value` harus berupa angka (ID) sesuai schema.prisma */}
                        <option value="1">Tumpukan Sampah</option>
                        <option value="2">Jalan Berlubang</option>
                        <option value="3">Penebangan Pohon Liar</option>
                        <option value="4">Pembuangan Limbah</option>
                        <option value="5">Genangan Air/Banjir</option>
                        <option value="6">Lainnya</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Foto Masalah</Form.Label>
                      {/* Input file ini tidak akan dikirim langsung, hanya untuk preview */}
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={onFile}
                        required
                      />
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          className="image-preview d-block"
                          alt="Preview"
                        />
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Deskripsi Masalah</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        rows={4}
                        placeholder="Jelaskan secara detail..."
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Lokasi</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          name="location"
                          id="problem-location"
                          placeholder="Masukkan alamat atau klik tombol di bawah"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={onGeo}
                        >
                          <i className="bi bi-geo-alt-fill me-2" />
                          Ambil Lokasi
                        </Button>
                      </div>
                      {/* Input tersembunyi untuk menyimpan latitude dan longitude */}
                      <input type="hidden" name="latitude" id="latitude" />
                      <input type="hidden" name="longitude" id="longitude" />
                      <div className="map-container">
                        <p className="text-muted mb-0">{mapText}</p>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="text-center mt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      ) : (
                        'Kirim Laporan'
                      )}
                    </Button>
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
            <i
              className="bi bi-check-circle-fill text-success"
              style={{ fontSize: '4rem' }}
            />
          </div>
          <p>
            Terima kasih telah melaporkan masalah lingkungan. Laporan Anda akan
            segera kami tindak lanjuti.
          </p>
          <p>
            Nomor laporan Anda: <strong>#{newReportId}</strong>
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button onClick={() => setShowSuccess(false)}>OK</Button>
          <Button
            variant="outline-primary"
            href="/daftar-masalah"
            onClick={() => setShowSuccess(false)}
          >
            Lihat Daftar Masalah
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
