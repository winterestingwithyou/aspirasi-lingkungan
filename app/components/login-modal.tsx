import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Modal } from "bootstrap";

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

  const modalElRef = useRef<HTMLDivElement>(null);
  const modalInstanceRef = useRef<Modal | null>(null);

  useEffect(() => {
    if (!modalElRef.current) return;

    const instance = Modal.getOrCreateInstance(modalElRef.current, {
      backdrop: true,
      focus: true,
      keyboard: true,
    });
    modalInstanceRef.current = instance;

    const handleHidden = () => setRole(null);
    modalElRef.current.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElRef.current?.removeEventListener("hidden.bs.modal", handleHidden);
      instance.dispose();
      modalInstanceRef.current = null;
    };
  }, []);

  // Sinkronkan prop `open` → show/hide
  useEffect(() => {
    const inst = modalInstanceRef.current;
    if (!inst) return;
    open ? inst.show() : inst.hide();
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return alert("Silakan pilih role terlebih dahulu");

    onClose();                    
    modalInstanceRef.current?.hide();
    nav(role === "citizen" ? "/dashboard/citizen" : "/dashboard/government");
  };

  return (
    <div
      ref={modalElRef}
      className="modal login-modal fade"
      id="loginModal"
      tabIndex={-1}
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div
            className="modal-header"
            style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
          >
            <h5 className="modal-title" id="loginModalLabel">Login ke Dashboard</h5>
            {/* biar animasi & backdrop di-handle Bootstrap; sinkronkan state parent juga */}
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" required />
              </div>

              <div className="mb-4">
                <label className="form-label">Pilih Role</label>
                <div className="d-flex gap-3 flex-wrap">
                  {[
                    { key: "citizen", label: "Warga", icon: "bi-person-fill" },
                    { key: "government", label: "Pemerintah", icon: "bi-building" },
                  ].map(({ key, label, icon }) => (
                    <button
                      type="button"
                      key={key}
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
              </div>

              <div className="d-grid">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
