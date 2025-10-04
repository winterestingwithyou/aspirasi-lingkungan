import { useRef, useEffect, useState } from 'react';
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
import { uploadToCloudinary, getAddress } from '~/services';
import type {
  ApiError,
  CreateReportResponse,
  ProblemType,
  Report,
} from '~/types';
import {
  createReportSchema,
  type CreateReportInput,
} from '~/validators/reports';

export function ReportPage({
  problemTypes,
  ptError,
}: {
  problemTypes: ProblemType[];
  ptError?: string | null;
}) {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [problemTypeId, setProblemTypeId] = useState<string>(''); // keep string for <option> value
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  const [mapText, setMapText] = useState<string>(
    'Peta akan ditampilkan di sini setelah lokasi ditentukan',
  );
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newReportId, setNewReportId] = useState<number | null>(null);

  const toNum = (v: string) => (v.trim() === '' ? NaN : Number(v));

  const updateAddressFrom = async (latNum: number, lonNum: number) => {
    const addr = await getAddress(latNum, lonNum);
    setLocation((prev) => (prev.trim() === '' ? addr : addr)); // isi/override lokasi
    setMapText(`Lokasi dipilih • ${addr}`);
  };

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
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
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lon = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat.toFixed(6));
        setLongitude(lon.toFixed(6));
        await updateAddressFrom(lat, lon);

        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lon]);
          mapRef.current.setView([lat, lon], 17);
        }
      },
      (err) => alert('Gagal mengambil lokasi: ' + err.message),
    );
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const basePayload: CreateReportInput = {
      reporterName,
      reporterContact,
      problemTypeId,
      description,
      photoUrl: null as string | null,
      location,
      latitude,
      longitude,
    };

    const parsed = createReportSchema.safeParse(basePayload);
    if (!parsed.success) {
      setIsSubmitting(false);
      setSubmitError(parsed.error.issues.map((i) => i.message).join(', '));
      return;
    }

    let dataToSend = parsed.data;
    if (photoFile) {
      const uploadedUrl = await uploadToCloudinary(photoFile);
      dataToSend = { ...dataToSend, photoUrl: uploadedUrl };
    }

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

  useEffect(() => {
    if (submitError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitError]);

  useEffect(() => {
    (async () => {
      if (mapRef.current || !mapContainerRef.current) return;

      const L = await import('leaflet');
      leafletRef.current = L;

      const latNum = toNum(latitude);
      const lonNum = toNum(longitude);
      const start: [number, number] =
        Number.isFinite(latNum) && Number.isFinite(lonNum)
          ? [latNum, lonNum]
          : [-2.5, 118.0];

      const map = L.map(mapContainerRef.current, {
        center: start,
        zoom: Number.isFinite(latNum) ? 16 : 5,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      // marker draggable
      const marker = L.marker(start, { draggable: true }).addTo(map);

      // klik pada map
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        await updateAddressFrom(lat, lng);
      });

      // drag marker selesai
      marker.on('dragend', async () => {
        const { lat, lng } = marker.getLatLng();
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        await updateAddressFrom(lat, lng);
      });

      mapRef.current = map;
      markerRef.current = marker;

      if (Number.isFinite(latNum) && Number.isFinite(lonNum)) {
        await updateAddressFrom(latNum, lonNum);
      } else {
        setMapText('Klik peta untuk memilih lokasi.');
      }
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Jika user mengubah input latitude/longitude manual, pan & update marker
  useEffect(() => {
    const L = leafletRef.current;
    if (!L || !mapRef.current || !markerRef.current) return;

    const latNum = toNum(latitude);
    const lonNum = toNum(longitude);
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return;

    markerRef.current.setLatLng([latNum, lonNum]);
    mapRef.current.setView(
      [latNum, lonNum],
      Math.max(mapRef.current.getZoom(), 16),
    );
    // Jangan reverse-geocode di setiap ketikan; cukup saat blur kalau mau.
  }, [latitude, longitude]);

  const selectDisabled = (problemTypes?.length ?? 0) === 0;

  return (
    <section className="page-section">
      <Container>
        <div className="text-center mb-5 mt-3">
          <h2 className="section-title">Form Pelaporan Masalah</h2>
          <p className="lead">Isi form untuk melaporkan masalah</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="form-container mt-0">
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              {ptError && <Alert variant="warning">{ptError}</Alert>}

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
                      <Form.Label>Nomor Whatsapp</Form.Label>
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
                        disabled={selectDisabled}
                      >
                        <option value="" disabled>
                          {selectDisabled
                            ? 'Memuat jenis masalah…'
                            : 'Pilih jenis masalah'}
                        </option>

                        {problemTypes?.map((pt) => (
                          <option key={pt.id} value={String(pt.id)}>
                            {pt.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="photoFile">
                      <Form.Label>Foto Masalah</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={onFile}
                        required
                      />
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          className="image-preview d-block mt-2 w-100 h-auto"
                          alt="Preview"
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
                      <Form.Label>Lokasi </Form.Label>
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

                      <div className="gap-2 mt-3">
                        <div className="map-container mt-2">
                          <div
                            ref={mapContainerRef}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 8,
                              overflow: 'hidden',
                            }}
                          />
                        </div>

                        <p className="text-muted mt-2 mb-0">{mapText}</p>
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
