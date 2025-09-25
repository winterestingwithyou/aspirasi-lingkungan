import { NavLink, Link } from "react-router";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

export default function Topbar({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <Navbar expand="lg" bg="#2E8B57" data-bs-theme="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-tree-fill me-2" />
          Lingkungan Bersih
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="mainnav" />
        <Navbar.Collapse id="mainnav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>Beranda</Nav.Link>
            <Nav.Link as={NavLink} to="/report">Laporkan Masalah</Nav.Link>
            <Nav.Link as={buttonLink} onClick={onOpenLogin}>Dashboard</Nav.Link>
            <Nav.Link href="#">Tentang</Nav.Link>
            <Nav.Link href="#">Kontak</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function buttonLink(props: React.ComponentProps<"button">) {
  return <button className="nav-link btn btn-link p-0" {...props} />;
}
