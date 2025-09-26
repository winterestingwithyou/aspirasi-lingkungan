export default function GovDashboard() {
  return (
    <>
      <div className="welcome-card mb-4">
        <h2>Selamat Datang, Admin!</h2>
        <p>Dashboard Sistem Pelaporan Masalah Lingkungan</p>
      </div>

      <div className="today-stats">
        <h4 className="mb-3">Statistik Hari Ini</h4>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="stats-card text-center">
              <div className="stats-number">4</div>
              <p>Laporan Masuk Hari Ini</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="stats-card text-center">
              <div className="stats-number">2</div>
              <p>Laporan Selesai Hari Ini</p>
            </div>
          </div>
        </div>
      </div>

      <div className="today-stats mt-4">
        <h4 className="mb-3">Statistik Berdasarkan Kategori</h4>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="stats-card text-center">
              <div className="stats-number">8</div>
              <p>Terselesaikan</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card text-center">
              <div className="stats-number">16</div>
              <p>Dalam Proses</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card text-center">
              <div className="stats-number">10</div>
              <p>Belum Ditindak</p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-4 mb-3">Laporan Terbaru</h4>
      {[
        {
          title: 'Tumpukan Sampah di Jalan Lunjuk',
          loc: 'Jalan Lunjuk, Bukit Lama',
          status: 'Sedang Diproses',
          date: '20 Mei 2025',
        },
        {
          title: 'Jalan Berlubang',
          loc: 'Perumahan Gardena',
          status: 'Menunggu Tindakan',
          date: '18 Mei 2025',
        },
      ].map((r, i) => (
        <div className="report-card" key={i}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5>{r.title}</h5>
              <p className="text-muted mb-2">
                <i className="bi bi-geo-alt-fill me-1" /> {r.loc}
              </p>
              <p className="mb-2">Deskripsi singkat laporan...</p>
              <span
                className={`report-status ${r.status.includes('Proses') ? 'status-progress' : r.status.includes('Menunggu') ? 'status-pending' : 'status-completed'}`}
              >
                {r.status}
              </span>
            </div>
            <div className="text-end">
              <small className="text-muted">{r.date}</small>
              <div className="mt-2">
                <a
                  className="btn btn-sm btn-outline-primary"
                  href="/gov/laporan/1"
                >
                  Detail
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
