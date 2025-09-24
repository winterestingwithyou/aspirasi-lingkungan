export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="footer-widget">
              <h5>Tentang Lingkungan Bersih</h5>
              <p>Platform pelaporan masalah lingkungan yang menghubungkan masyarakat dengan pemerintah.</p>
              <div className="social-icons mt-3">
                <a href="#"><i className="bi bi-facebook" /></a>
                <a href="#"><i className="bi bi-twitter" /></a>
                <a href="#"><i className="bi bi-instagram" /></a>
                <a href="#"><i className="bi bi-youtube" /></a>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-widget">
              <h5>Menu Cepat</h5>
              <ul className="footer-links">
                <li><a href="#">Beranda</a></li>
                <li><a href="#">Laporkan Masalah</a></li>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Tentang Kami</a></li>
                <li><a href="#">Kontak</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="footer-widget">
              <h5>Hubungi Kami</h5>
              <ul className="footer-links">
                <li><i className="bi bi-geo-alt me-2"></i> Jl. Lingkungan Bersih No. 123</li>
                <li><i className="bi bi-telephone me-2"></i> (021) 1234-5678</li>
                <li><i className="bi bi-envelope me-2"></i> info@lingkunganbersih.id</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="footer-widget">
              <h5>Newsletter</h5>
              <p>Daftar untuk mendapatkan update terbaru tentang lingkungan</p>
              <form className="mt-3">
                <div className="input-group mb-3">
                  <input type="email" className="form-control" placeholder="Email Anda" />
                  <button className="btn btn-primary" type="button">Daftar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Lingkungan Bersih. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
