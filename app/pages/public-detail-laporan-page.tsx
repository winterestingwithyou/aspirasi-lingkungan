import { Link, useLoaderData } from 'react-router';
import { Carousel, Col, Container, Row } from 'react-bootstrap';
import type { ReportDetail } from '~/types';
import { badge, statusText } from '~/helper/report-status';
import { formatDateToIndonesian } from '~/helper/date';

const captionClassName =
  'd-inline-block bg-dark bg-opacity-75 text-white rounded px-3 py-2';

const prevIcon = (
  <span className="custom-carousel-icon" aria-hidden="true">
    <i className="bi bi-chevron-left" />
  </span>
);

const nextIcon = (
  <span className="custom-carousel-icon" aria-hidden="true">
    <i className="bi bi-chevron-right" />
  </span>
);

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

const progressCircleBase: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: 16,
  marginRight: '10px',
  flexShrink: 0,
};

const progressCirclePalette: Array<
  Pick<React.CSSProperties, 'background' | 'color'>
> = [
  {
    background: '#cfe2ff',
    color: '#084298',
  },
  {
    background: '#e2e3ff',
    color: '#3d348b',
  },
  {
    background: '#ffe5d9',
    color: '#9c2a1b',
  },
  {
    background: '#d1e7dd',
    color: '#0f5132',
  },
];

export default function PublicDetailLaporanPage() {
  const report = useLoaderData<ReportDetail>();

  return (
    <section className="page-section pt-4 pt-md-5">
      <Container>
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
          <h2 className="mb-0">Detail Laporan #{report.id}</h2>
          <Link
            to="/daftar-masalah"
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 shadow-sm"
          >
            <i className="bi bi-arrow-left" />
            <span>Kembali</span>
          </Link>
        </div>

        <Row className="align-items-stretch g-4">
          <Col md={6} className="d-flex" style={{ minHeight: 300 }}>
            <Carousel
              style={carouselStyle}
              className="w-100"
              prevIcon={prevIcon}
              nextIcon={nextIcon}
            >
              <Carousel.Item>
                <img
                  style={imgStyle}
                  src={report.photoUrl}
                  alt="Dokumentasi Laporan"
                />
                <Carousel.Caption>
                  <strong className={captionClassName}>
                    Dokumentasi Laporan
                  </strong>
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
                      <strong className={captionClassName}>{p.phase}</strong>
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
                <p className="mb-0">{report.description}</p>
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
              <Row key={progress.id} className="py-3 border-bottom">
                <Col md={3} className="mb-2 mb-md-0">
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                    <div
                      style={{
                        ...progressCircleBase,
                        ...(progressCirclePalette[
                          index % progressCirclePalette.length
                        ] ?? progressCirclePalette[0]),
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="fw-semibold ms-2 ms-md-3">
                      {progress.phase}
                    </span>
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
