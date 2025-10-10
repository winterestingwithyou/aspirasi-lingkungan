import { useActionData, useLoaderData, Form, Link } from 'react-router';
import { Alert } from 'react-bootstrap';
import { statusText } from '~/helper/report-status';

type LoaderData = {
  reportId: number;
  currentStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  allowedNext: Array<'IN_PROGRESS' | 'COMPLETED'>;
  isFakeReport?: boolean;
};

type ActionData =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export default function GovTambahProgress() {
  const data = useLoaderData<LoaderData>();
  const result = useActionData<ActionData>();

  const disabled = data.currentStatus === 'COMPLETED' || data.isFakeReport;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Tambah Progress Laporan #{data.reportId}</h3>
        <Link
          to={`/gov/laporan/${data.reportId}`}
          className="btn btn-outline-secondary"
        >
          Kembali
        </Link>
      </div>

      {disabled && (
        <Alert variant="warning">
          {data.isFakeReport
            ? 'Laporan ini telah ditandai sebagai palsu. Penambahan progress dinonaktifkan.'
            : 'Status laporan sudah COMPLETED. Tidak dapat menambah progress baru.'}
        </Alert>
      )}

      {result && !result.ok && (
        <Alert variant="danger" className="mb-3">
          {result.message}
        </Alert>
      )}

      <Form method="post" className="border rounded p-3" replace>
        <div className="mb-3">
          <label className="form-label">Fase Progress</label>
          <input
            name="phase"
            className="form-control"
            placeholder="Fase Progress saat ini...."
            disabled={disabled}
          />
          {result && result.ok === false && result.fieldErrors?.phase && (
            <div className="text-danger small mt-1">
              {result.fieldErrors.status}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select name="status" className="form-select" disabled={disabled}>
            {data.allowedNext.map((s) => (
              <option key={s} value={s}>
                {statusText(s)}
              </option>
            ))}
          </select>
          {result && result.ok === false && result.fieldErrors?.status && (
            <div className="text-danger small mt-1">
              {result.fieldErrors.status}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Deskripsi</label>
          <textarea
            name="description"
            className="form-control"
            rows={4}
            placeholder="Jelaskan progres penanganan…"
            disabled={disabled}
          />
          {result && result.ok === false && result.fieldErrors?.description && (
            <div className="text-danger small mt-1">
              {result.fieldErrors.description}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">URL Foto Progress (opsional)</label>
          <input
            type="url"
            name="progressPhotoUrl"
            className="form-control"
            placeholder="https://…"
            disabled={disabled}
          />
        </div>

        <button className="btn btn-primary" disabled={disabled}>
          Simpan Progress
        </button>
      </Form>
    </div>
  );
}
