import { useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { useLoginModal } from './login-modal-provider';

export default function NavbarTop() {
  const { open } = useLoginModal();
  const [expanded, setExpanded] = useState(false);

  // Fungsi untuk menutup navbar, dipanggil setiap kali link diklik
  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      data-bs-theme="dark"
      sticky="top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img
            alt="ECO-RAPID Logo"
            src="/eco-rapid-black-white.png"
            height="32"
            className="d-inline-block align-top me-2"
          />
          ECO-RAPID
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" onClick={handleNavClick}>
              Beranda
            </Nav.Link>
            <Nav.Link as={NavLink} to="/laporkan" onClick={handleNavClick}>
              Laporkan
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/daftar-masalah"
              onClick={handleNavClick}
            >
              Daftar Masalah
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tentang-kami" onClick={handleNavClick}>
              Tentang Kami
            </Nav.Link>
            <Nav.Link as={NavLink} to="/kontak" onClick={handleNavClick}>
              Kontak
            </Nav.Link>
            <Nav.Link
              as={Button}
              variant="outline-secondary"
              className="ms-lg-2 mt-2 mt-lg-0 border border-white px-4"
              onClick={() => {
                open();
                handleNavClick();
              }}
            >
              Log In
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
