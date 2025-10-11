import { Link, useLoaderData } from 'react-router';
import { Card, Col, Row } from 'react-bootstrap';
import { statusText, badge } from '~/helper/report-status';
import { formatDateToIndonesian } from '~/helper/date';
import type { ReportStatus } from '~/prisma-enums';

type LoaderData = {
  id: number;
  phase: string;
  description: string;
  progressPhotoUrl: string | null;
  createdAt: string;
  reportStatus: ReportStatus;
  report: {
    id: number;
    reporterName: string;
    status: ReportStatus;
    problemType: { name: string };
  };
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    departmentName: string;
  } | null;
};

export default function GovProgressDetail() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div className="d-flex flex-column justify-content-start">
          <div className="d-flex flex-row align-items-center gap-3">
            <h3 className="mb-0">Detail Progress #{data.id}</h3>
            <span className={`report-status ${badge(data.reportStatus)}`}>
              {statusText(data.reportStatus)}
            </span>
          </div>
          <small className="text-muted">
            Laporan #{data.report.id} - {data.report.problemType.name}
          </small>
        </div>
        <Link
          to={`/gov/laporan/${data.report.id}`}
          className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 shadow-sm"
        >
          <i className="bi bi-arrow-left" />
          <span>Kembali ke Laporan</span>
        </Link>
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="shadow-sm">
            {data.progressPhotoUrl ? (
              <Card.Img
                variant="top"
                src={data.progressPhotoUrl}
                alt={data.phase}
                style={{ objectFit: 'cover', maxHeight: 360 }}
              />
            ) : (
              <div
                className="d-flex flex-column align-items-center justify-content-center text-muted py-5"
                style={{ background: '#f8f9fa' }}
              >
                <i
                  className="bi bi-image-alt mb-2"
                  style={{ fontSize: '2rem' }}
                />
                <span>Foto progress tidak tersedia</span>
              </div>
            )}
            <Card.Body>
              <Card.Title className="mb-3">{data.phase}</Card.Title>
              <div className="text-muted small">
                Diperbarui pada {formatDateToIndonesian(data.createdAt, true)}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Informasi Progress</h5>
              <dl className="row mb-0">
                <dt className="col-sm-4">Fase</dt>
                <dd className="col-sm-8">{data.phase}</dd>
                <dt className="col-sm-4">Status</dt>
                <dd className="col-sm-8">{statusText(data.reportStatus)}</dd>
                <dt className="col-sm-4">Tanggal</dt>
                <dd className="col-sm-8">
                  {formatDateToIndonesian(data.createdAt, true)}
                </dd>
                <dt className="col-sm-4">Pelapor</dt>
                <dd className="col-sm-8">{data.report.reporterName}</dd>
              </dl>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Petugas Penanggung Jawab</h5>
              {data.user ? (
                <dl className="row mb-0">
                  <dt className="col-sm-4">Nama</dt>
                  <dd className="col-sm-8">{data.user.fullName}</dd>
                  <dt className="col-sm-4">Username</dt>
                  <dd className="col-sm-8">@{data.user.username}</dd>
                  <dt className="col-sm-4">Email</dt>
                  <dd className="col-sm-8">{data.user.email}</dd>
                  <dt className="col-sm-4">Departemen</dt>
                  <dd className="col-sm-8">{data.user.departmentName}</dd>
                </dl>
              ) : (
                <p className="text-muted mb-0">Data petugas tidak tersedia.</p>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Deskripsi Progress</h5>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {data.description}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
