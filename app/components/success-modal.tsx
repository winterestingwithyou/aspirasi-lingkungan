export default function SuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="modal fade show d-block" tabIndex={-1} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center">
          <div className="modal-header border-0">
            <h5 className="modal-title">Laporan Berhasil Dikirim!</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }} />
            </div>
            <p>Terima kasih, laporan Anda akan segera ditindaklanjuti.</p>
            <p>Nomor laporan: <strong>#ENV2023000123</strong></p>
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button className="btn btn-primary" onClick={onClose}>OK</button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </div>
  );
}
