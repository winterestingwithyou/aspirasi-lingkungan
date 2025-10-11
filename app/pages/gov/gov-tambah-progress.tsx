import {
  type ChangeEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useFetcher, useLoaderData, Link } from 'react-router';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { statusText } from '~/helper/report-status';
import { uploadToCloudinary } from '~/services';
import { reportProgressClientSchema } from '~/validators/report-progress';

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
  const fetcher = useFetcher<ActionData>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [clientMessage, setClientMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const defaultStatus = data.allowedNext[0] ?? '';

  const disabledByStatus =
    data.currentStatus === 'COMPLETED' || data.isFakeReport;
  const isSubmitting = fetcher.state === 'submitting';
  const isBusy = isUploading || isSubmitting;
  const disableInputs = disabledByStatus || isBusy;

  const serverResult = fetcher.data;
  const serverFieldErrors =
    serverResult && serverResult.ok === false
      ? (serverResult.fieldErrors ?? {})
      : {};

  const takeMessage = <T extends string>(
    client: T | undefined,
    server: T | undefined,
  ) => client ?? server;

  const phaseError = takeMessage(clientErrors.phase, serverFieldErrors.phase);
  const statusError = takeMessage(
    clientErrors.status,
    serverFieldErrors.status,
  );
  const descriptionError = takeMessage(
    clientErrors.description,
    serverFieldErrors.description,
  );
  const photoError = takeMessage(
    clientErrors.progressPhoto,
    serverFieldErrors.progressPhotoUrl,
  );

  const generalError =
    clientMessage ??
    (serverResult && serverResult.ok === false ? serverResult.message : null);

  const fileAreaClassName = disableInputs
    ? 'file-upload-area text-center p-4 disabled'
    : 'file-upload-area text-center p-4 cursor-pointer';

  const clearClientError = useCallback((field: string) => {
    setClientErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setClientMessage(null);
  }, []);

  const triggerFileDialog = useCallback(() => {
    if (disableInputs) return;
    fileInputRef.current?.click();
  }, [disableInputs]);

  const handleFileAreaKeyDown: KeyboardEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerFileDialog();
    }
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (disableInputs) return;

    const file = event.target.files?.[0] ?? null;
    setPhotoFile(file);
    clearClientError('progressPhoto');

    if (!file) {
      setPhotoPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const value = e.target?.result;
      setPhotoPreview(typeof value === 'string' ? value : null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (disabledByStatus || isBusy) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const parsed = reportProgressClientSchema.safeParse({
      phase: formData.get('phase'),
      status: formData.get('status'),
      description: formData.get('description'),
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      const nextErrors: Record<string, string> = {};
      if (flattened.phase?.[0]) nextErrors.phase = flattened.phase[0];
      if (flattened.status?.[0]) {
        nextErrors.status = 'Status progress wajib dipilih';
      }
      if (flattened.description?.[0]) {
        nextErrors.description = flattened.description[0];
      }
      setClientErrors(nextErrors);
      setClientMessage('Periksa kembali isian Anda.');
      return;
    }

    setClientErrors({});
    setClientMessage(null);

    if (!photoFile) {
      const message = 'Foto progress wajib diunggah.';
      setClientErrors({ progressPhoto: message });
      setClientMessage('Periksa kembali isian Anda.');
      return;
    }

    setIsUploading(true);
    let progressPhotoUrl = '';
    try {
      progressPhotoUrl = await uploadToCloudinary(photoFile);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal mengunggah foto progress.';
      setClientErrors({ progressPhoto: message });
      setClientMessage(message);
      return;
    } finally {
      setIsUploading(false);
    }

    if (!progressPhotoUrl) {
      const message = 'Gagal mengunggah foto progress.';
      setClientErrors({ progressPhoto: message });
      setClientMessage(message);
      return;
    }

    const submission = new FormData();
    submission.set('phase', parsed.data.phase);
    submission.set('status', parsed.data.status);
    submission.set('description', parsed.data.description);
    submission.set('progressPhotoUrl', progressPhotoUrl);

    fetcher.submit(submission, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };

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

      {disabledByStatus && (
        <Alert variant="warning">
          {data.isFakeReport
            ? 'Laporan ini telah ditandai sebagai palsu. Penambahan progress dinonaktifkan.'
            : 'Status laporan sudah COMPLETED. Tidak dapat menambah progress baru.'}
        </Alert>
      )}

      {generalError && (
        <Alert variant="danger" className="mb-3">
          {generalError}
        </Alert>
      )}

      <Form
        noValidate
        onSubmit={handleSubmit}
        className="border rounded p-3"
        encType="multipart/form-data"
      >
        <Form.Group className="mb-3" controlId="phase">
          <Form.Label>Fase Progress</Form.Label>
          <Form.Control
            name="phase"
            placeholder="Fase Progress saat ini...."
            disabled={disableInputs}
            onChange={() => clearClientError('phase')}
          />
          {phaseError && (
            <div className="text-danger small mt-1">{phaseError}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            disabled={disableInputs}
            onChange={() => clearClientError('status')}
            defaultValue={defaultStatus}
          >
            {data.allowedNext.map((s) => (
              <option key={s} value={s}>
                {statusText(s)}
              </option>
            ))}
          </Form.Select>
          {statusError && (
            <div className="text-danger small mt-1">{statusError}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Deskripsi</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={4}
            placeholder="Jelaskan progres penanganan..."
            disabled={disableInputs}
            onChange={() => clearClientError('description')}
          />
          {descriptionError && (
            <div className="text-danger small mt-1">{descriptionError}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="progressPhoto">
          <Form.Label>Foto Progress</Form.Label>
          <div
            className={fileAreaClassName}
            role="button"
            tabIndex={0}
            aria-disabled={disableInputs}
            onClick={triggerFileDialog}
            onKeyDown={handleFileAreaKeyDown}
            style={{ cursor: disableInputs ? 'not-allowed' : 'pointer' }}
          >
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept="image/*"
              name="progressPhoto"
              hidden
              disabled={disableInputs}
              onChange={handleFileChange}
            />
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview foto progress"
                className="image-preview d-block w-100 h-auto"
                style={{ maxHeight: 220, objectFit: 'cover' }}
              />
            ) : (
              <div>
                <i
                  className="bi bi-cloud-arrow-up-fill"
                  style={{ fontSize: '2.5rem' }}
                />
                <p className="mb-0 mt-2">Klik disini untuk mengunggah gambar</p>
                <small className="text-muted">(Format: JPG, PNG, WEBP)</small>
              </div>
            )}
          </div>
          {photoError && (
            <div className="text-danger small mt-1">{photoError}</div>
          )}
        </Form.Group>

        <Button
          className="w-100"
          type="submit"
          variant="primary"
          disabled={disableInputs}
        >
          {isBusy ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              {isUploading ? 'Mengunggah Foto...' : 'Menyimpan...'}
            </>
          ) : (
            'Simpan Progress'
          )}
        </Button>
      </Form>
    </div>
  );
}
