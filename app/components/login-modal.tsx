import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Role = "citizen" | "government" | null;
export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [role, setRole] = useState<Role>(null);
  const nav = useNavigate();

  useEffect(() => { if (!open) setRole(null); }, [open]);
  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return alert("Silakan pilih role terlebih dahulu");
    onClose();
    nav(role === "citizen" ? "/dashboard/citizen" : "/dashboard/government");
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content login-modal">
          <div className="modal-header" style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}>
            <h5 className="modal-title">Login ke Dashboard</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
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
                        role === key ? "border-success bg-success bg-opacity-10" : "border-secondary"
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
      <div className="modal-backdrop fade show" onClick={onClose} />
    </div>
  );
}
