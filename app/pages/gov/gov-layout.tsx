import type { PropsWithChildren } from 'react';
import { Col, Container } from 'react-bootstrap';
import { NavLink } from 'react-router';

export default function GovLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="page-section">
        <Container>
          <div className="row">
            <Col lg={3} className="mb-4">
              <div className="dashboard-sidebar">
                <h4 className="mb-4">Menu</h4>
                <ul className="dashboard-menu">
                  <li>
                    <NavLink to="/gov" end className="nav-link-aside">
                      <i className="bi bi-speedometer2" /> Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/gov/laporan" className="nav-link-aside">
                      <i className="bi bi-file-earmark-text" /> Laporan
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/gov/profil" className="nav-link-aside">
                      <i className="bi bi-person-circle" /> Profil
                    </NavLink>
                  </li>
                  <li>
                    <a className="nav-link-aside" href="#">
                      <i className="bi bi-gear" /> Pengaturan
                    </a>
                  </li>
                  <li>
                    <a className="nav-link-aside" href="/">
                      <i className="bi bi-box-arrow-right" /> Log Out
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={9}>
              <div className="dashboard-content">{children}</div>
            </Col>
          </div>
        </Container>
      </div>
    </>
  );
}
