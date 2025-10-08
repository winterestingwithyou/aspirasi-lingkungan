import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { useLoginModal } from './login-modal-provider';

export default function NavbarTop() {
  const { open } = useLoginModal();
  return (
    <Navbar expand="lg" data-bs-theme="dark" sticky="top" className="shadow-sm">
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
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">
              Beranda
            </Nav.Link>
            <Nav.Link as={NavLink} to="/laporkan">
              Laporkan
            </Nav.Link>
            <Nav.Link as={NavLink} to="/daftar-masalah">
              Daftar Masalah
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tentang-kami">
              Tentang Kami
            </Nav.Link>
            <Nav.Link as={NavLink} to="/kontak">
              Kontak
            </Nav.Link>
            <Nav.Link onClick={open}>Log In</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
