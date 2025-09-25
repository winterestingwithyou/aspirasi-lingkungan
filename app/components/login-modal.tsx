import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

type Role = "citizen" | "government" | null;

export default function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [role, setRole] = useState<Role>(null);
  const nav = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (role === "citizen") nav("/dashboard/citizen");
    else if (role === "government") nav("/dashboard/gov");
    onClose();
  };

  return (
    <Modal show={open} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Masuk ke Dashboard</Modal.Title>
        </Modal.Header>

        <Modal.Body className="vstack gap-3">
          <div className="text-muted">
            Pilih peranmu lalu lanjutkan login.
          </div>

          <div className="d-flex gap-3 justify-content-between">
            {([
              ["citizen", "Warga", "bi-person-fill"],
              ["government", "Petugas", "bi-building-check"],
            ] as const).map(([key, label, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key as Role)}
                className={`flex-fill border rounded-3 p-3 text-center ${
                  role === key
                    ? "border-success bg-success bg-opacity-10"
                    : "border-secondary"
                }`}
                style={{ minWidth: 160 }}
              >
                <i className={`bi ${icon} fs-3 text-success`} />
                <div className="fw-semibold mt-1">{label}</div>
              </button>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={!role}>
            Login
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
