import { Link } from 'react-router-dom';

export default function GovRiwayat() {
  //data dummy
  const laporanSelesai = [
    {
      id: 1,
      judul: 'Tumpukan Sampah di Jalan Lunjuk',
      tanggal: '22 Mei 2025',
      pelapor: 'Robin',
      lokasi: 'Jalan Lunjuk',
    },
    {
      id: 2,
      judul: 'Saluran Air Tersumbat',
      tanggal: '18 Mei 2025',
      pelapor: 'Dewi',
      lokasi: 'Jl. Merdeka',
    },
  ];

  const laporanPalsu = [
    {
      id: 3,
      judul: 'Pohon Tumbang di Taman Kota',
      tanggal: '15 Mei 2025',
      pelapor: 'Budi',
      lokasi: 'Taman Kota',
    },
  ];

  return (
    <div>
      <h2>Riwayat Laporan Masalah</h2>

      <div className="mb-5">
        <h4 className="mb-3">Laporan Selesai</h4>
        {laporanSelesai.length === 0 ? (
          <div className="alert alert-info">Belum ada laporan yang selesai.</div>
        ) : (
          <ul className="list-group">
            {laporanSelesai.map((laporan) => (
              <li key={laporan.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{laporan.judul}</strong>
                  <div className="small text-muted">
                    {laporan.tanggal} &middot; {laporan.pelapor} &middot; {laporan.lokasi}
                  </div>
                </div>
                <Link to={`/gov/laporan/${laporan.id}`} className="btn btn-outline-primary btn-sm">
                  Detail
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="mb-3">Laporan Ditandai Palsu</h4>
        {laporanPalsu.length === 0 ? (
          <div className="alert alert-info">Tidak ada laporan palsu.</div>
        ) : (
          <ul className="list-group">
            {laporanPalsu.map((laporan) => (
              <li key={laporan.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{laporan.judul}</strong>
                  <div className="small text-muted">
                    {laporan.tanggal} &middot; {laporan.pelapor} &middot; {laporan.lokasi}
                  </div>
                </div>
                <Link to={`/gov/laporan/${laporan.id}`} className="btn btn-outline-secondary btn-sm">
                  Detail
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}