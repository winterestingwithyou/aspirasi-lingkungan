export default function GovProfil() {
  return (
    <>
      <h2 className="mb-4">Profil Pengguna</h2>
      <div className="profile-card">
        <div className="text-center mb-4">
          <img
            src="https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/cd05/live/7b2cff30-c423-11ee-97bb-5d4fd58ca91c.jpg.webp"
            alt="Profile"
            className="profile-avatar"
          />
          <h4>Mulyono</h4>
          <p className="text-muted">Administrator Dinas Lingkungan Hidup</p>
        </div>

        <div className="row">
          {[
            { label: "Nama Lengkap", val: "Budi Santoso", ro: false },
            { label: "Username", val: "Mulyono20ggAw", ro: true },
            { label: "Email", val: "muly@gmail.com", ro: false },
            { label: "No. Telepon", val: "081234567890", ro: false },
            { label: "Jabatan", val: "Kepala Seksi Pengaduan Masyarakat", ro: true },
            { label: "Unit Kerja", val: "DLH Provinsi Sumatera Selatan", ro: true },
          ].map((f, i) => (
            <div className="col-md-6" key={i}>
              <div className="mb-3">
                <label className="form-label">{f.label}</label>
                <input className="form-control" defaultValue={f.val} readOnly={f.ro} />
              </div>
            </div>
          ))}
          <div className="col-12">
            <div className="mb-3">
              <label className="form-label">Alamat</label>
              <textarea className="form-control" rows={2} defaultValue="Jl. Angkatan 45, samping ayam geprek bang dedek" />
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button type="button" className="btn btn-primary">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    </>
  );
}
