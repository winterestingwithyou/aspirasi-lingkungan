import { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useFetcher, useRevalidator } from 'react-router';
import type { Report, ReportDetail } from '~/types';

function FakeReportButton({ report }: { report: Report | ReportDetail }) {
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [showError, setShowError] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const actionData = fetcher.data as
    | { status: number }
    | { status: number; error: string }
    | undefined;

  // Tutup modal & refresh data saat fetcher sukses
  useEffect(() => {
    if (fetcher.state === 'idle' && actionData && actionData?.status === 200) {
      setShowForm(false);
      setShowConfirm(false);
      setReason('');
      setShowError(false);
      setSuccessMsg('Laporan berhasil ditandai sebagai palsu.');
      revalidator.revalidate();
    }
  }, [fetcher.state, actionData, revalidator]);

  if (report.isFakeReport) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);

    const formData = new FormData(e.currentTarget);
    formData.set('reason', reason);
    fetcher.submit(formData, {
      method: 'post',
      action: `/gov/laporan/${report.id}/fake`,
    });
  };

  return (
    <>
      {/* Alert Sukses / Error (inline di halaman) */}
      {successMsg && (
        <Alert
          variant="success"
          onClose={() => setSuccessMsg(null)}
          dismissible
          className="mb-3"
        >
          {successMsg}
        </Alert>
      )}
      {fetcher.data?.error && (
        <Alert
          variant="danger"
          onClose={() => (fetcher.data.error = null)}
          dismissible
          className="mb-3"
        >
          {fetcher.data.error}
        </Alert>
      )}

      {/* Tombol utama */}
      <Button variant="outline-danger" onClick={() => setShowConfirm(true)}>
        Tandai Palsu
      </Button>

      {/* 1) Modal Konfirmasi */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Penandaan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menandai laporan ini sebagai{' '}
          <strong>palsu</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowConfirm(false);
              setShowForm(true);
            }}
          >
            Lanjutkan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 2) Modal Form Alasan */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Form
          as={fetcher.Form}
          method="post"
          action={`/gov/laporan/${report.id}/fake`}
          onSubmit={handleSubmit}
        >
          <Modal.Header closeButton>
            <Modal.Title>Alasan Menandai Palsu</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {showError && (
              <Alert
                variant="danger"
                onClose={() => setShowError(false)}
                dismissible
                className="mb-3"
              >
                Mohon isi alasan terlebih dahulu.
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Alasan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                placeholder="Tuliskan alasan mengapa laporan ini dianggap palsu..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                disabled={fetcher.state !== 'idle'}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowForm(false)}
              disabled={fetcher.state !== 'idle'}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state === 'submitting' ? 'Mengirim...' : 'Kirim'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export { FakeReportButton };
