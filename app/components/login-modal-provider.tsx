// src/components/LoginModalProvider.tsx
import { createContext, useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
type Ctx = { open: () => void };
const LoginCtx = createContext<Ctx>({ open: () => {} });
export const useLoginModal = () => useContext(LoginCtx);

export default function LoginModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const u = String(data.get('username') || '');
    const p = String(data.get('password') || '');
    if (u === 'admin' && p === 'admin') {
      setShow(false);
      window.location.href = '/gov'; // masuk ke dashboard pemerintah
    } else {
      alert('Username atau password salah!');
    }
  };
  return (
    <LoginCtx.Provider value={{ open: () => setShow(true) }}>
      {children}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Login Pemerintah</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </LoginCtx.Provider>
  );
}
