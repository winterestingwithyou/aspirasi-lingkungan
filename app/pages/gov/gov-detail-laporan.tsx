import { Link, useLoaderData } from 'react-router';
import { Carousel, Col, Row } from 'react-bootstrap';
import type { ReportDetail } from '~/types';
import { badge, statusText } from '~/helper/report-status';
import { formatDateToIndonesian } from '~/helper/date';
import { ReportStatus } from '~/prisma-enums';
import { FakeReportButton } from '~/components/fake-report-button';

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
  border: '1px solid transparent',
};

const progressCircleColors: Record<
  ReportStatus,
  Pick<React.CSSProperties, 'background' | 'color' | 'border'>
> = {
  PENDING: {
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffe29a',
  },
  IN_PROGRESS: {
    background: '#cfe2ff',
    color: '#084298',
    border: '1px solid #9ec5fe',
  },
  COMPLETED: {
    background: '#d1e7dd',
    color: '#0f5132',
    border: '1px solid #a3cfbb',
  },
  FAKE_REPORT: {
    background: '#ffebee',
    color: '#c62828',
    border: '1px solid #ffcdd2',
  },
};

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

export default function GovDetailLaporan() {
  const report = useLoaderData<ReportDetail>();

  const canAddProgress =
    report.status !== ReportStatus.COMPLETED && !report.isFakeReport;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <h2 className="mb-0">Detail Laporan #{report.id}</h2>
        <Link
          to={`/gov/laporan`}
          className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 shadow-sm"
        >
          <i className="bi bi-arrow-left" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="row align-items-stretch">
        <div className="col-md-6 d-flex" style={{ minHeight: 300 }}>
          <Carousel
            style={carouselStyle}
            className="w-100"
            prevIcon={prevIcon}
            nextIcon={nextIcon}
          >
            <Carousel.Item>
              <img style={imgStyle} src={report.photoUrl} alt="Foto Pelapor" />
              <Carousel.Caption>
                <strong className={captionClassName}>Foto Pelapor</strong>
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
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div>
            <div className="mb-2">
              <strong>Informasi Pelapor</strong>
              <div>Nama: {report.reporterName}</div>
              <div>Kontak: {report.reporterContact || '-'}</div>
            </div>
            <div className="mb-2">
              <strong>Informasi Masalah</strong>
              <div>Jenis: {report.problemType.name}</div>
              <div>Lokasi: {report.location || 'Tidak ada detail lokasi'}</div>
              <div>Tanggal: {formatDateToIndonesian(report.createdAt)}</div>
              <div>
                Status:{' '}
                <span className={`report-status ${badge(report.status)}`}>
                  {statusText(report.status)}
                </span>
              </div>
            </div>
            <div>
              <strong>Deskripsi Masalah</strong>
              <div>{report.description}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-end gap-2">
          {canAddProgress && (
            <Link
              to={`/gov/laporan/${report.id}/tambah-progress`}
              className="btn btn-primary"
            >
              Tambah Progress
            </Link>
          )}

          {!report.isFakeReport &&
            !(report.status === ReportStatus.COMPLETED) && (
              <FakeReportButton report={report} />
            )}
        </div>
      </div>
      <div className="mt-4">
        <h5>Riwayat Penanganan</h5>
        <div className="mt-3 border rounded p-3">
          {/* Header Tabel */}
          <Row className="fw-bold border-bottom pb-2 mb-2 d-none d-md-flex">
            <Col md={3} className="text-center">
              Fase Progress
            </Col>
            <Col md={4} className="text-center">
              Deskripsi
            </Col>
            <Col md={3} className="text-center">
              Waktu
            </Col>
            <Col md={2} className="text-center">
              Aksi
            </Col>
          </Row>
          {report.progressUpdates.length === 0 && (
            <div className="text-center text-muted py-3">
              Belum ada riwayat penanganan.
            </div>
          )}
          {report.progressUpdates.map((progress, index) => {
            const statusKey = (progress.reportStatus ??
              ReportStatus.PENDING) as ReportStatus;
            const colorStyle =
              progressCircleColors[statusKey] ?? progressCircleColors.PENDING;
            return (
              <Row key={progress.id} className="py-3 border-bottom">
                <Col md={3} className="mb-2 mb-md-0">
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                    <div style={{ ...progressCircleBase, ...colorStyle }}>
                      {index + 1}
                    </div>
                    <span className="fw-semibold ms-2 ms-md-3">
                      {progress.phase}
                    </span>
                  </div>
                </Col>
                <Col md={4} className="small text-center my-auto">
                  {progress.description}
                </Col>
                <Col md={3} className="text-muted small text-center my-auto">
                  {formatDateToIndonesian(progress.createdAt, true)}
                </Col>
                <Col
                  md={2}
                  className="text-center my-auto mt-3 mt-md-0 d-flex justify-content-center"
                >
                  <Link
                    to={`/gov/laporan/${report.id}/progress/${progress.id}`}
                    className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-eye" />
                    <span>Detail</span>
                  </Link>
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
}
