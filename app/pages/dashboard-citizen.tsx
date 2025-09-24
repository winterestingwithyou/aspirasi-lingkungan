// src/pages/DashboardCitizen.tsx
export default function DashboardCitizen() {
  const data = [
    { t: "Tumpukan Sampah di Jalan Sudirman", p: "Jalan Sudirman No. 123, Jakarta Pusat", d: "Tumpukan sampah sudah lebih dari seminggu...", s: "Selesai", date: "20 Mei 2023" },
    { t: "Jalan Berlubang di Perumahan", p: "Perumahan Griya Asri, Blok C No. 15", d: "Jalan di depan rumah saya berlubang cukup dalam...", s: "Menunggu Tindakan", date: "18 Mei 2023" },
    { t: "Pembuangan Limbah Pabrik ke Sungai", p: "Sungai Citarum, dekat Pabrik Tekstil", d: "Pabrik diduga membuang limbah...", s: "Selesai", date: "15 Mei 2023" },
  ];

  return (
    <section className="page-section">
      <div className="container">
        <div className="row">
          <aside className="col-lg-3">
            <div className="dashboard-sidebar">
              <h4 className="mb-4">Menu</h4>
              <ul className="dashboard-menu">
                <li><a className="active" href="#"><i className="bi bi-speedometer2 me-2" />Dashboard</a></li>
                <li><a href="/report"><i className="bi bi-plus-circle me-2" />Buat Laporan</a></li>
                <li><a href="#"><i className="bi bi-file-earmark-text me-2" />Laporan Saya</a></li>
                <li><a href="#"><i className="bi bi-bookmark me-2" />Tersimpan</a></li>
                <li><a href="#"><i className="bi bi-gear me-2" />Pengaturan</a></li>
              </ul>
            </div>
          </aside>

          <main className="col-lg-9">
            <div className="dashboard-content">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard Warga</h2>
                <span className="badge bg-primary">Anda login sebagai: Warga</span>
              </div>

              <div className="row g-4 mb-4">
                {[
                  ["Total Laporan Saya", "5"],
                  ["Menunggu Tindakan", "1"],
                  ["Selesai", "4"],
                ].map(([t, n]) => (
                  <div className="col-md-4" key={t}>
                    <div className="stats-card">
                      <div className="stats-number">{n}</div>
                      <p>{t}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="filter-section">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Filter Status</label>
                    <select className="form-select" defaultValue="all">
                      <option value="all">Semua Status</option>
                      <option value="pending">Menunggu Tindakan</option>
                      <option value="progress">Sedang Diproses</option>
                      <option value="completed">Selesai</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Filter Jenis Masalah</label>
                    <select className="form-select" defaultValue="all">
                      <option value="all">Semua Jenis</option>
                      <option value="sampah">Tumpukan Sampah</option>
                      <option value="jalan">Jalan Berlubang</option>
                      <option value="pohon">Penebangan Pohon Liar</option>
                      <option value="limbah">Pembuangan Limbah</option>
                      <option value="banjir">Genangan Air/Banjir</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Cari Laporan</label>
                    <div className="input-group">
                      <input className="form-control" placeholder="Cari berdasarkan lokasi..." />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="bi bi-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="mb-3">Laporan Saya</h4>
              <div>
                {data.map((r) => (
                  <article key={r.t} className="report-card">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h5>{r.t}</h5>
                        <p className="text-muted mb-2"><i className="bi bi-geo-alt-fill me-1" /> {r.p}</p>
                        <p className="mb-2">{r.d}</p>
                        <span className={`report-status ${r.s === "Selesai" ? "status-completed" : r.s === "Menunggu Tindakan" ? "status-pending" : "status-progress"}`}>
                          {r.s}
                        </span>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">{r.date}</small>
                        <div className="mt-2">
                          <button className="btn btn-sm btn-outline-primary">Detail</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled"><a className="page-link" href="#">Sebelumnya</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">Selanjutnya</a></li>
                </ul>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
