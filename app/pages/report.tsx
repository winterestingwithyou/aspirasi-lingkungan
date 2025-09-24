import { useOutletContext } from "react-router";
import { useRef, useState } from "react";

type Ctx = { openSuccess: () => void };

export default function Report() {
  const { openSuccess } = useOutletContext<Ctx>();
  const [preview, setPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFileChange(f?: File) {
    if (!f) return setPreview(null);
    const r = new FileReader();
    r.onload = e => setPreview(String(e.target?.result ?? ""));
    r.readAsDataURL(f);
  }

  function getLocation() {
    if (!navigator.geolocation) return alert("Browser tidak mendukung geolokasi");
    navigator.geolocation.getCurrentPosition(
      pos => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => alert("Error getting location: " + err.message)
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    openSuccess();
    (e.target as HTMLFormElement).reset();
    setPreview(null);
    setCoords(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Formulir Pelaporan Masalah Lingkungan</h2>
          <p className="lead">Laporkan masalah lingkungan yang Anda temukan</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="form-container">
              <form onSubmit={submit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nama Pelapor</label>
                      <input className="form-control" required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Kontak (Email/No. HP)</label>
                      <input className="form-control" required />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Jenis Masalah</label>
                      <select className="form-select" required defaultValue="">
                        <option value="" disabled>Pilih jenis masalah</option>
                        <option value="sampah">Tumpukan Sampah</option>
                        <option value="jalan">Jalan Berlubang</option>
                        <option value="pohon">Penebangan Pohon Liar</option>
                        <option value="limbah">Pembuangan Limbah</option>
                        <option value="banjir">Genangan Air/Banjir</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Foto Masalah</label>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        required
                        className="form-control"
                        onChange={(e) => onFileChange(e.target.files?.[0])}
                      />
                      {preview && <img className="image-preview" src={preview} alt="Preview" />}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Deskripsi Masalah</label>
                      <textarea className="form-control" rows={4} required placeholder="Jelaskan secara detail..." />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Lokasi</label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          placeholder="Masukkan alamat atau klik tombol di bawah"
                          defaultValue={
                            coords ? `Lat: ${coords.lat.toFixed(6)}, Long: ${coords.lon.toFixed(6)}` : ""
                          }
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={getLocation}>
                          <i className="bi bi-geo-alt-fill"></i> Ambil Lokasi
                        </button>
                      </div>
                      <div className="map-container">
                        {coords ? (
                          <div className="text-center">
                            <i className="bi bi-geo-alt-fill text-success" style={{ fontSize: "3rem" }} />
                            <p className="mt-2 mb-0">Lokasi berhasil ditentukan</p>
                            <small className="text-muted">
                              Lat: {coords.lat.toFixed(6)}, Long: {coords.lon.toFixed(6)}
                            </small>
                          </div>
                        ) : (
                          <p className="text-muted m-0">Peta akan ditampilkan di sini setelah lokasi ditentukan</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 text-center mt-4">
                    <button className="btn btn-primary btn-lg">Kirim Laporan</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
