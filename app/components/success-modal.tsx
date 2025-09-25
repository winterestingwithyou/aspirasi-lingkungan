import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Laporan Berhasil Dikirim!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <i className="bi bi-check-circle-fill fs-1 text-success d-block mb-2" />
        Terima kasih atas partisipasimu menjaga lingkungan.
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button onClick={onClose} variant="success">
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
