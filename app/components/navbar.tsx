import { Link, NavLink } from "react-router";

export default function Navbar({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-tree-fill me-2" />
          Lingkungan Bersih
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Beranda</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/report">Laporkan Masalah</NavLink></li>
            <li className="nav-item">
              <button className="nav-link btn btn-link p-0" onClick={onOpenLogin}>Dashboard</button>
            </li>
            <li className="nav-item"><a className="nav-link" href="#">Tentang</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Kontak</a></li>
            <li className="nav-item">
              <button className="nav-link btn btn-link p-0" onClick={onOpenLogin}>
                <i className="bi bi-person-circle" /> Masuk
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
