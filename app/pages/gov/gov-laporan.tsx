import { Form, Pagination } from "react-bootstrap";

export default function GovLaporan() {
  return (
    <>
      <h2 className="mb-4">Daftar Laporan Masalah</h2>

      <div className="filter-section">
        <div className="row g-3">
          <div className="col-md-4">
            <Form.Label>Pencarian Laporan</Form.Label>
            <div className="input-group">
              <Form.Control placeholder="Cari berdasarkan judul atau lokasi..." />
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search" />
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <Form.Label>Filter Kategori</Form.Label>
            <Form.Select defaultValue="all">
              <option value="all">Semua Kategori</option>
              <option value="sampah">Tumpukan Sampah</option>
              <option value="jalan">Jalan Berlubang</option>
              <option value="pohon">Penebangan Pohon Liar</option>
              <option value="limbah">Pembuangan Limbah</option>
              <option value="banjir">Genangan Air/Banjir</option>
              <option value="lainnya">Lainnya</option>
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Label>Filter Status</Form.Label>
            <Form.Select defaultValue="all">
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Tindakan</option>
              <option value="progress">Sedang Diproses</option>
              <option value="completed">Selesai</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {[1,2,3,4].map((id) => (
        <div className="report-card" key={id}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5>Laporan #{id}</h5>
              <p className="text-muted mb-2"><i className="bi bi-geo-alt-fill me-1" /> Lokasi Contoh</p>
              <p className="mb-2">Ringkasan laporan...</p>
              <span className={`report-status ${id%3===0 ? "status-completed" : id%2===0 ? "status-pending" : "status-progress"}`}>
                {id%3===0 ? "Selesai" : id%2===0 ? "Menunggu Tindakan" : "Sedang Diproses"}
              </span>
            </div>
            <div className="text-end">
              <small className="text-muted">20 Mei 2025</small>
              <div className="mt-2">
                <a className="btn btn-sm btn-outline-primary" href={`/gov/laporan/${id}`}>Detail</a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <nav aria-label="Page navigation" className="mt-4">
        <Pagination className="justify-content-center">
          <Pagination.Prev disabled>Sebelumnya</Pagination.Prev>
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Next>Selanjutnya</Pagination.Next>
        </Pagination>
      </nav>
    </>
  );
}
