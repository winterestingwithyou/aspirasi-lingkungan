import { useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getAddress } from '~/services';
import type { ApiError, CreateReportResponse, Report } from '~/types';

export default function ReportPage() {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState(''); // opsional
  const [problemTypeId, setProblemTypeId] = useState<string>(''); // disimpan string, dikirim number
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(''); // opsional
  const [latitude, setLatitude] = useState<string>(''); // wajib → valid number
  const [longitude, setLongitude] = useState<string>(''); // wajib → valid number

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

  const onGeo = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung browser Anda.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lon);
        const locationString = await getAddress(lat, lon);
        setMapText(`Lokasi berhasil ditentukan • ${locationString}`);
        // opsional: isi field lokasi dengan koordinat sebagai fallback
        if (!location.trim()) setLocation(locationString);
      },
      (err) => alert('Gagal mengambil lokasi: ' + err.message),
    );
  };

  const normalizeOptional = (val: string) =>
    val.trim() === '' ? undefined : val.trim();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validasi sederhana sebelum kirim (selaras dengan Zod)
    if (!reporterName.trim()) {
      setIsSubmitting(false);
      return setSubmitError('Nama pelapor diperlukan');
    }
    if (!problemTypeId) {
      setIsSubmitting(false);
      return setSubmitError('Jenis masalah wajib dipilih');
    }
    if (!description.trim() || description.trim().length < 10) {
      setIsSubmitting(false);
      return setSubmitError('Deskripsi terlalu pendek (min. 10 karakter)');
    }
    if (!latitude || !longitude) {
      setIsSubmitting(false);
      return setSubmitError(
        'Koordinat lokasi belum ditentukan. Klik "Ambil Lokasi".',
      );
    }

    // --- PENTING: Upload gambar seharusnya ke storage → dapatkan URL-nya ---
    // Untuk demo gunakan placeholder:
    const photoUrl =
      'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

    const dataToSend = {
      reporterName: reporterName.trim(),
      reporterContact: normalizeOptional(reporterContact), // opsional → undefined/null
      problemTypeId: Number(problemTypeId),
      description: description.trim(),
      photoUrl, // ganti dengan URL hasil upload nyata
      location: normalizeOptional(location), // opsional
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result: CreateReportResponse = await response.json();

      if (!response.ok) {
        const err = result as ApiError;
        const errorMessage =
          err.error ||
          (err.issues &&
            Array.isArray(err.issues) &&
            err.issues.map((i) => i.message).join(', ')) ||
          'Terjadi kesalahan pada server.';
        throw new Error(errorMessage);
      }

      const success = result as { message: string; data: Report };
      setNewReportId(success.data.id);
      setShowSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Gagal mengirim laporan. Silakan coba lagi.',
      );
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
                    <Form.Group controlId="reporterName">
                      <Form.Label>Nama Pelapor</Form.Label>
                      <Form.Control
                        name="reporterName"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="reporterContact">
                      <Form.Label>Nomor Whatsapp (opsional)</Form.Label>
                      <Form.Control
                        name="reporterContact"
                        value={reporterContact}
                        onChange={(e) => setReporterContact(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="problemTypeId">
                      <Form.Label>Jenis Masalah</Form.Label>
                      <Form.Select
                        name="problemTypeId"
                        value={problemTypeId}
                        onChange={(e) => setProblemTypeId(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Pilih jenis masalah
                        </option>
                        {/* ID numeric sesuai schema.prisma */}
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
                    <Form.Group controlId="photoFile">
                      <Form.Label>Foto Masalah</Form.Label>
                      {/* Input file ini hanya untuk preview; upload sesungguhnya ke storage */}
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={onFile}
                        required
                      />
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          className="image-preview d-block mt-2"
                          alt="Preview"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      )}
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="description">
                      <Form.Label>Deskripsi Masalah</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        rows={4}
                        placeholder="Jelaskan secara detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="location">
                      <Form.Label>Lokasi (opsional)</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          name="location"
                          placeholder="Masukkan alamat atau klik 'Ambil Lokasi'"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
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

                      {/* Simpan lat/lon di state + kirim dalam body JSON */}
                      <div className="mt-2">
                        <Row className="g-2">
                          <Col sm={6}>
                            <Form.Group controlId="latitude">
                              <Form.Label className="mb-1">
                                Latitude *
                              </Form.Label>
                              <Form.Control
                                name="latitude"
                                placeholder="-6.2"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                required
                                inputMode="decimal"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={6}>
                            <Form.Group controlId="longitude">
                              <Form.Label className="mb-1">
                                Longitude *
                              </Form.Label>
                              <Form.Control
                                name="longitude"
                                placeholder="106.8"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                                inputMode="decimal"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      <div className="map-container mt-2">
                        <p className="text-muted mb-0">{mapText}</p>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="text-center mt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
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
            onClick={() => navigate('/daftar-masalah') && setShowSuccess(false)}
          >
            Lihat Daftar Masalah
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
