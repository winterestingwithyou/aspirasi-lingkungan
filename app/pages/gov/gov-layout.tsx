import { type PropsWithChildren, useState } from 'react';
import { Button, Col, Container, Offcanvas } from 'react-bootstrap';
import { NavLink } from 'react-router';

export default function GovLayout({ children }: PropsWithChildren) {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  // Ekstrak konten sidebar ke dalam variabel agar bisa digunakan kembali
  const sidebarContent = (
    <div className="dashboard-sidebar">
      <h4 className="mb-4">Menu</h4>
      <ul className="dashboard-menu">
        <li>
          <NavLink to="/gov" end className="nav-link-aside" onClick={handleCloseSidebar}>
            <i className="bi bi-speedometer2" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/gov/laporan" className="nav-link-aside" onClick={handleCloseSidebar}>
            <i className="bi bi-file-earmark-text" /> Laporan
          </NavLink>
        </li>
        <li>
          <NavLink to="/gov/jenis-masalah" className="nav-link-aside" onClick={handleCloseSidebar}>
            <i className="bi bi-tags" /> Jenis Masalah
          </NavLink>
        </li>
        <li>
          <NavLink to="/gov/profil" className="nav-link-aside" onClick={handleCloseSidebar}>
            <i className="bi bi-person-circle" /> Profil
          </NavLink>
        </li>
        <li>
          <NavLink to="/gov/pengaturan" className="nav-link-aside" onClick={handleCloseSidebar}>
            <i className="bi bi-gear" /> Pengaturan
          </NavLink>
        </li>
        <li>
          <a className="nav-link-aside" href="/">
            <i className="bi bi-box-arrow-right" /> Log Out
          </a>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <div className="page-section">
        <Container>
          {/* Tombol Hamburger untuk Tampilan Mobile */}
          <Button
            variant="outline-primary"
            className="d-lg-none mb-3 w-100"
            onClick={handleShowSidebar}
          >
            <i className="bi bi-list me-2" />
            Menu
          </Button>

          <div className="row">
            {/* Sidebar Statis untuk Tampilan Desktop */}
            <Col lg={3} className="d-none d-lg-block">
              {sidebarContent}
            </Col>

            {/* Konten Utama */}
            <Col lg={9}>
              <div className="dashboard-content">{children}</div>
            </Col>
          </div>

          {/* Sidebar Offcanvas untuk Tampilan Mobile */}
          <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="start" className="offcanvas-half">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="d-flex align-items-center">
                <div
                  className="py-2 px-3 rounded d-inline-flex align-items-center"
                  style={{ backgroundColor: '#2e8b57', color: 'white' }}
                >
                  <img
                    alt="ECO-RAPID Logo"
                    src="/eco-rapid-black-white.png"
                    height="30"
                    className="d-inline-block align-top me-2"
                  />
                  <span className="fw-bold">ECO-RAPID</span>
                </div>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{sidebarContent}</Offcanvas.Body>
          </Offcanvas>
        </Container>
      </div>
    </>
  );
}
