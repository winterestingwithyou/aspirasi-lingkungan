import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FormEventHandler,
} from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useAuth } from '~/context/auth-context';

type LoginContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const LoginCtx = createContext<LoginContextValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export const useLoginModal = () => useContext(LoginCtx);

export default function LoginModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoginModalProviderInner>{children}</LoginModalProviderInner>;
}

function LoginModalProviderInner({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { client, refreshSession } = useAuth();

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    setShow(false);
    setErrorMessage(null);
  }, []);

  const handleOpen = useCallback(() => {
    setErrorMessage(null);
    setShow(true);
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      setErrorMessage('Mohon isi email dan password Anda.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await client.signIn.email(
        {
          email,
          password,
        },
        {
          onError(context) {
            console.error('Error during sign up:', context.error);
          },
        },
      );
      if ('error' in response && response.error) {
        const message =
          response.error.message ??
          (response.error.code === 'INVALID_CREDENTIALS'
            ? 'Email atau password salah.'
            : null) ??
          'Gagal masuk. Silakan periksa kembali data Anda.';

        setErrorMessage(message);
        return;
      }

      form.reset();
      handleClose();
      refreshSession();

      navigate('/gov');
    } catch (error) {
      console.error('Failed to sign in', error);
      setErrorMessage('Terjadi kesalahan pada server. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = useMemo<LoginContextValue>(
    () => ({
      open: handleOpen,
      close: handleClose,
      isOpen: show,
    }),
    [handleClose, handleOpen, show],
  );

  return (
    <LoginCtx.Provider value={value}>
      {children}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Login Pemerintah</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {errorMessage ? (
              <Alert variant="danger" className="mb-3">
                {errorMessage}
              </Alert>
            ) : null}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                placeholder="contoh: user@mail.com"
                autoComplete="email"
                disabled={isSubmitting}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              type="submit"
              className="w-100 d-flex justify-content-center align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" role="status" />
                  <span>Memproses...</span>
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </LoginCtx.Provider>
  );
}
