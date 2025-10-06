import { Link } from 'react-router';
import { Carousel, Col, Row } from 'react-bootstrap';
import type { ReportDetail } from '~/types';
import { badge, statusText } from './gov-laporan';

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

function formatTanggal(iso: string | Date, withTime = false) {
  try {
    const d = new Date(iso);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    if (withTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return d.toLocaleDateString('id-ID', options) + (withTime ? ' WIB' : '');
  } catch {
    return String(iso);
  }
}

export default function GovDetailLaporan({ report }: { report: ReportDetail }) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detail Laporan #{report.id}</h2>
        <Link className="btn btn-primary d-flex align-items-center" to={`/gov/laporan/${report.id}/edit`}>
          <i className="bi bi-pencil-square me-1" />
          <span className="d-none d-md-inline">Edit Laporan</span>
        </Link>
      </div>

      <div className="row align-items-stretch">
        <div className="col-md-6 d-flex" style={{ minHeight: 300 }}>
          <Carousel style={carouselStyle} className="w-100">
            <Carousel.Item>
              <img
                style={imgStyle} src={report.photoUrl} alt="Foto Pelapor" />
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
              <div>Tanggal: {formatTanggal(report.createdAt)}</div>
              <div>
                Status:{' '}
                <span className={`badge ${badge(report.status).replace('report-status ', '')}`}>
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
            <Col md={3} className="text-center">Status</Col>
            <Col md={6} className="text-center">Deskripsi</Col>
            <Col md={3} className="text-center">Waktu</Col>
          </Row>
          {report.progressUpdates.length === 0 && (
            <div className="text-center text-muted py-3">Belum ada riwayat penanganan.</div>
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
              <Col md={6} className="small text-center my-auto">{progress.description}</Col>
              <Col md={3} className="text-muted small text-center my-auto">
                {formatTanggal(progress.createdAt, true)}
              </Col>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
}
