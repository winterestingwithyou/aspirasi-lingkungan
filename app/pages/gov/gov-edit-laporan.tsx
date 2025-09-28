import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';

export default function GovEditLaporan() {
  const nav = useNavigate();
  const [status, setStatus] = useState<'pending' | 'progress' | 'completed'>(
    'progress',
  );
  const [previewProgress, setPreviewProgress] = useState<string | null>(null);
  const [previewCompleted, setPreviewCompleted] = useState<string | null>(null);

  const onPreview = (file: File, setter: (s: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => setter(String(e.target?.result || ''));
    reader.readAsDataURL(file);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert('Perubahan berhasil disimpan!');
    nav('/gov/laporan/1');
  };

  const pickFileFromEvent = (e: React.ChangeEvent<any>) => {
    const input = e.currentTarget as HTMLInputElement; // pastikan sebagai <input type="file">
    return input.files?.[0];
  };

  return (
    <>
      <h2 className="mb-4">Edit Laporan Masalah</h2>
      <div className="form-container">
        <Form onSubmit={onSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nama Pelapor</Form.Label>
                <Form.Control value="Ahmad Fauzi" readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Kontak</Form.Label>
                <Form.Control value="ahmad.fauzi@email.com" readOnly />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Jenis Masalah</Form.Label>
                <Form.Control value="Tumpukan Sampah" readOnly />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Lokasi</Form.Label>
                <Form.Control
                  value="Jalan Sudirman No. 123, Jakarta Pusat"
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Deskripsi Masalah</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue="Tumpukan sampah sudah lebih dari seminggu tidak diangkut..."
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="pending">Menunggu Tindakan</option>
                  <option value="progress">Sedang Diproses</option>
                  <option value="completed">Selesai</option>
                  <option value="completed">Laporan Palsu</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Evidence - progress */}
            <div
              id="progress-evidence-section"
              className={`evidence-section ${
                status === 'progress' || status === 'completed'
                  ? 'show'
                  : 'hidden'
              }`}
            >
              <h5>Unggah Bukti Sedang Diproses</h5>
              <p>
                Unggah foto sebagai bukti bahwa masalah sedang dalam proses
                penanganan
              </p>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = pickFileFromEvent(e);
                  if (f) onPreview(f, (s) => setPreviewProgress(s));
                }}
              />
              {previewProgress && (
                <img
                  src={previewProgress}
                  className="image-preview d-block"
                  alt="Progress Preview"
                />
              )}
            </div>

            {/* Evidence - completed */}
            <div
              id="completed-evidence-section"
              className={`evidence-section ${status === 'completed' ? 'show' : 'hidden'}`}
            >
              <h5>Unggah Bukti Selesai</h5>
              <p>
                Unggah foto sebagai bukti bahwa masalah telah selesai ditangani
              </p>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = pickFileFromEvent(e);
                  if (f) onPreview(f, (s) => setPreviewCompleted(s));
                }}
              />
              {previewCompleted && (
                <img
                  src={previewCompleted}
                  className="image-preview d-block"
                  alt="Completed Preview"
                />
              )}
            </div>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Catatan Progress</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue="Tim DLH sedang menuju lokasi untuk pengecekan."
                />
              </Form.Group>
            </Col>

            <Col xs={12} className="text-center mt-4">
              <Link to="/gov/laporan/1" className="btn btn-secondary me-2">
                Batal
              </Link>
              <Button type="submit">Simpan Perubahan</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
