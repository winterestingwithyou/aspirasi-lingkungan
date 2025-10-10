import { Link, useLoaderData } from 'react-router';
import { Carousel, Col, Row } from 'react-bootstrap';
import type { ReportDetail } from '~/types';
import { badge, statusText } from '~/helper/report-status';
import { formatDateToIndonesian } from '~/helper/date';
import { ReportStatus } from '~/prisma-enums';
import { FakeReportButton } from '~/components/fake-report-button';

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detail Laporan #{report.id}</h2>
        <div className="d-flex gap-2">
          {canAddProgress && (
            <Link
              to={`/gov/laporan/${report.id}/tambah-progress`}
              className="btn btn-primary"
            >
              Tambah Progress
            </Link>
          )}

          {!report.isFakeReport && <FakeReportButton report={report} />}
        </div>
      </div>

      <div className="row align-items-stretch">
        <div className="col-md-6 d-flex" style={{ minHeight: 300 }}>
          <Carousel style={carouselStyle} className="w-100">
            <Carousel.Item>
              <img style={imgStyle} src={report.photoUrl} alt="Foto Pelapor" />
              <Carousel.Caption>
                <strong>Foto Pelapor</strong>
              </Carousel.Caption>
            </Carousel.Item>
            {report.progressUpdates
              .filter((p) => p.progressPhotoUrl)
              .map((p, i) => (
                <Carousel.Item key={p.id}>
                  <img
                    style={imgStyle}
                    src={p.progressPhotoUrl!}
                    alt={`Progress ${i + 1}`}
                  />
                  <Carousel.Caption>
                    <strong>{p.status}</strong>
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
        <h5>Riwayat Penanganan</h5>
        <div className="mt-3 border rounded p-3">
          {/* Header Tabel */}
          <Row className="fw-bold border-bottom pb-2 mb-2 d-none d-md-flex">
            <Col md={3} className="text-center">
              Status
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
                  <span className="fw-semibold">{progress.status}</span>
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
    </div>
  );
}
