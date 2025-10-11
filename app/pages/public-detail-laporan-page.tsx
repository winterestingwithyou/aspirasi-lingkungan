import { useLoaderData } from 'react-router';
import { Carousel, Col, Container, Row } from 'react-bootstrap';
import type { ReportDetail } from '~/types';
import { badge, statusText } from '~/helper/report-status';
import { formatDateToIndonesian } from '~/helper/date';

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

export default function PublicDetailLaporanPage() {
  const report = useLoaderData<ReportDetail>();

  return (
    <section className="page-section">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Detail Laporan #{report.id}</h2>
        </div>

        <Row className="align-items-stretch g-4">
          <Col md={6} className="d-flex" style={{ minHeight: 300 }}>
            <Carousel style={carouselStyle} className="w-100">
              <Carousel.Item>
                <img
                  style={imgStyle}
                  src={report.photoUrl}
                  alt="Foto Pelapor"
                />
                <Carousel.Caption>
                  <strong>Foto Pelapor</strong>
                </Carousel.Caption>
              </Carousel.Item>
              {report.progressUpdates
                .filter((p) => p.progressPhotoUrl)
                .map((p) => (
                  <Carousel.Item key={p.id}>
                    <img
                      style={imgStyle}
                      src={p.progressPhotoUrl!}
                      alt={p.phase}
                    />
                    <Carousel.Caption>
                      <strong>{p.phase}</strong>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
            </Carousel>
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-between">
            <div>
              <div className="mb-3">
                <strong>Informasi Masalah</strong>
                <div>Jenis: {report.problemType.name}</div>
                <div>
                  Lokasi: {report.location || 'Tidak ada detail lokasi'}
                </div>
                <div>
                  Tanggal Lapor: {formatDateToIndonesian(report.createdAt)}
                </div>
                <div>
                  Status:{' '}
                  <span className={`report-status ${badge(report.status)}`}>
                    {statusText(report.status)}
                  </span>
                </div>
              </div>
              <div>
                <strong>Deskripsi Masalah</strong>
                <p>{report.description}</p>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-5">
          <h5>Riwayat Penanganan</h5>
          <div className="mt-3 border rounded p-3">
            {/* Header Tabel */}
            <Row className="fw-bold border-bottom pb-2 mb-2 d-none d-md-flex">
              <Col md={3} className="text-center">
                Fase Progress
              </Col>
              <Col md={6} className="text-center">
                Deskripsi
              </Col>
              <Col md={3} className="text-center">
                Waktu
              </Col>
            </Row>
            {report.progressUpdates.length === 0 && (
              <div className="text-center text-muted py-3">
                Belum ada riwayat penanganan.
              </div>
            )}
            {report.progressUpdates.map((progress, index) => (
              <Row key={progress.id} className="py-2 border-bottom">
                <Col md={3}>
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#0d6efd',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 16,
                        marginRight: '10px',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="fw-semibold">{progress.phase}</span>
                  </div>
                </Col>
                <Col md={6} className="small text-center my-auto">
                  {progress.description}
                </Col>
                <Col md={3} className="text-muted small text-center my-auto">
                  {formatDateToIndonesian(progress.createdAt, true)}
                </Col>
              </Row>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
