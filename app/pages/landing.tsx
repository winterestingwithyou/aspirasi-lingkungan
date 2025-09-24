import { Link } from "react-router";

export default function Landing() {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <h1>Laporkan Masalah Lingkungan di Sekitarmu</h1>
          <p>Bersama-sama menjaga kebersihan dan kelestarian lingkungan untuk generasi mendatang</p>
          <Link to="/report" className="btn btn-primary btn-lg">Laporkan Sekarang</Link>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Cara Kerja</h2>
            <p className="lead">3 langkah mudah untuk melaporkan masalah lingkungan</p>
          </div>
          <div className="row g-4">
            {[
              { icon: "bi-clipboard2-check-fill", t: "Laporkan Masalah", d: "Isi formulir, lampirkan foto, dan tentukan lokasi." },
              { icon: "bi-people-fill", t: "Tindak Lanjut", d: "Dinas lingkungan hidup menindaklanjuti laporan Anda." },
              { icon: "bi-check-circle-fill", t: "Pantau Progress", d: "Pantau status penyelesaian secara real-time." },
            ].map((f) => (
              <div className="col-md-4" key={f.t}>
                <div className="feature-card text-center">
                  <div className="feature-icon"><i className={`bi ${f.icon}`} /></div>
                  <h4>{f.t}</h4>
                  <p>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Statistik Pelaporan</h2>
            <p className="lead">Dampak nyata dari partisipasi masyarakat</p>
          </div>
          <div className="row g-4">
            {[
              ["1,245", "Total Laporan"],
              ["892", "Selesai Ditangani"],
              ["210", "Sedang Diproses"],
              ["143", "Menunggu Tindakan"],
            ].map(([n, t]) => (
              <div className="col-md-3 col-6" key={t}>
                <div className="stats-card">
                  <div className="stats-number">{n}</div>
                  <p>{t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
