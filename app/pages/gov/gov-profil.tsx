import { useRef, useState } from 'react';

export default function GovProfil() {
  // State untuk semua field (termasuk jabatan dan foto)
  const [form, setForm] = useState({
    nama: 'Mulyono',
    username: 'Mulyono20ggAw',
    email: 'muly@gmail.com',
    telp: '081234567890',
    jabatan: 'Kepala Seksi Pengaduan Masyarakat',
    unit: 'DLH Provinsi Sumatera Selatan',
    alamat: 'Jl. Angkatan 45, samping ayam geprek bang dedek',
    foto: 'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/cd05/live/7b2cff30-c423-11ee-97bb-5d4fd58ca91c.jpg.webp',
  });

  // State untuk menampilkan profil yang sudah disimpan
  const [profile, setProfile] = useState(form);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Untuk preview foto baru di form
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({
          ...prev,
          foto: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Untuk handle perubahan field form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simpan perubahan (baru update profile state saat klik simpan)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(form);
    alert('Perubahan profil berhasil disimpan!');
  };

  return (
    <>
      <h2 className="mb-4">Profil Pengguna</h2>
      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={profile.foto}
              alt="Profile"
              className="profile-avatar"
              style={{ cursor: 'pointer', border: '3px solid #2eaf60', width: 120, height: 120, objectFit: 'cover', borderRadius: '50%' }}
              onClick={() => fileInputRef.current?.click()}
            />
            <button
              type="button"
              className="btn btn-light btn-sm"
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                border: '1px solid #ccc',
                padding: 6,
              }}
              onClick={() => fileInputRef.current?.click()}
              title="Ganti Foto"
            >
              <i className="bi bi-camera"></i>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFotoChange}
            />
          </div>
          <h4 className="mt-3">{profile.nama}</h4>
          <p className="text-muted">{profile.jabatan}</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Nama Lengkap</label>
              <input
                className="form-control"
                name="nama"
                value={form.nama}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">No. Telepon</label>
              <input
                className="form-control"
                name="telp"
                value={form.telp}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Jabatan</label>
              <input
                className="form-control"
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Unit Kerja</label>
              <input
                className="form-control"
                name="unit"
                value={form.unit}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-3">
              <label className="form-label">Alamat</label>
              <textarea
                className="form-control"
                name="alamat"
                rows={2}
                value={form.alamat}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </>
  );
}