import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';
import TurnstileWidget from '~/components/turnstile-widget';

type LoaderData = {
  siteKey: string;
};

type FeedbackType = 'bugs' | 'questions' | 'comments';

type ActionResponse =
  | { success: true }
  | { success: false; error: string; details?: unknown };

export default function KontakPage() {
  const { siteKey } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const fetcher = useFetcher<ActionResponse>();

  const [type, setType] = useState<FeedbackType | ''>('');
  const [feedback, setFeedback] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [bugPreview, setBugPreview] = useState<string | null>(null);
  const [tsToken, setTsToken] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isSubmitting = fetcher.state === 'submitting';
  const isLoading = fetcher.state === 'loading' && !!fetcher.formData;
  const isBusy = isSubmitting || isLoading;

  const isFormReady =
    Boolean(type) &&
    Boolean(feedback.trim()) &&
    Boolean(first.trim()) &&
    Boolean(email.trim()) &&
    Boolean(tsToken);

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setBugPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const value = ev.target?.result;
      setBugPreview(typeof value === 'string' ? value : null);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setType('');
    setFeedback('');
    setFirst('');
    setLast('');
    setEmail('');
    setBugPreview(null);
    setTsToken(null);
    setSubmitError(null);
    setTurnstileKey((prev) => prev + 1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (type === 'bugs') return;
    setBugPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [type]);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setSubmitError(null);
    }
  }, [fetcher.state]);

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;

    if (fetcher.data.success) {
      resetForm();
      setShowSuccess(true);
      return;
    }

    const details = Array.isArray(fetcher.data.details)
      ? fetcher.data.details
      : [];
    const captchaExpired = details.includes('timeout-or-duplicate');
    const message = captchaExpired
      ? 'Verifikasi captcha kedaluwarsa. Silakan coba lagi.'
      : fetcher.data.error || 'Gagal mengirim pesan';

    setSubmitError(message);
    setTsToken(null);
    setTurnstileKey((prev) => prev + 1);
  }, [fetcher.state, fetcher.data]);

  const handleFileAreaClick = () => {
    if (type !== 'bugs') return;
    fileInputRef.current?.click();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFileAreaClick();
    }
  };

  const handleCloseAndRedirect = () => {
    setShowSuccess(false);
    navigate('/');
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isBusy) return;

      if (!tsToken) {
        setSubmitError('Verifikasi captcha diperlukan sebelum mengirim pesan.');
        return;
      }

      const form = event.currentTarget;
      const submission = new FormData(form);
      submission.delete('cf-turnstile-response');
      submission.delete('f-turnstile-response');
      submission.set('cf-turnstile-response', tsToken);

      fetcher.submit(submission, {
        method: 'post',
        encType: 'multipart/form-data',
      });
    },
    [fetcher, isBusy, tsToken],
  );

  return (
    <section className="page-section">
      <Container>
        <div className="text-center mb-5 mt-3">
          <h2 className="section-title">Form Kontak & Feedback</h2>
          <p className="lead">Kami siap untuk mendengarkan pendapat Anda.</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="form-container mt-0">
              <fetcher.Form
                method="post"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
              >
                {submitError && (
                  <Alert variant="danger" className="mb-4">
                    {submitError}
                  </Alert>
                )}

                {/* Card 1: Jenis Feedback */}
                <Card className="mb-4 shadow-sm">
                  <Card.Header as="h5">
                    <i className="bi bi-tags-fill me-2" />
                    Jenis Feedback<span className="text-danger">*</span>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group>
                      <div className="d-flex flex-wrap gap-3">
                        <Form.Check
                          type="radio"
                          label="Lapor Bug/Error"
                          name="type"
                          id="type-bugs"
                          value="bugs"
                          checked={type === 'bugs'}
                          onChange={() => setType('bugs')}
                          required
                          disabled={isBusy}
                        />
                        <Form.Check
                          type="radio"
                          label="Pertanyaan"
                          name="type"
                          id="type-questions"
                          value="questions"
                          checked={type === 'questions'}
                          onChange={() => setType('questions')}
                          required
                          disabled={isBusy}
                        />
                        <Form.Check
                          type="radio"
                          label="Komentar/Saran"
                          name="type"
                          id="type-comments"
                          value="comments"
                          checked={type === 'comments'}
                          onChange={() => setType('comments')}
                          required
                          disabled={isBusy}
                        />
                      </div>
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Card 2: Detail Pesan */}
                <Card className="mb-4 shadow-sm">
                  <Card.Header as="h5">
                    <i className="bi bi-chat-left-text-fill me-2" />
                    Detail Pesan
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group controlId="feedback">
                          <Form.Label>
                            Pesan<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            name="feedback"
                            rows={4}
                            value={feedback}
                            onChange={(event) =>
                              setFeedback(event.target.value)
                            }
                            placeholder="Tuliskan pesan, pertanyaan, atau deskripsi bug Anda di sini..."
                            required
                            disabled={isBusy}
                          />
                        </Form.Group>
                      </Col>
                      {type === 'bugs' && (
                        <Col xs={12}>
                          <Form.Group controlId="bugFile">
                            <Form.Label>
                              Screenshot Bug{' '}
                              <span className="text-muted">(Opsional)</span>
                            </Form.Label>
                            <div
                              className="file-upload-area text-center p-4"
                              role="button"
                              tabIndex={0}
                              onClick={handleFileAreaClick}
                              onKeyDown={handleKeyDown}
                            >
                              <Form.Control
                                ref={fileInputRef}
                                type="file"
                                name="screenshot"
                                accept="image/*"
                                onChange={onFile}
                                hidden
                                disabled={isBusy}
                              />
                              {bugPreview ? (
                                <img
                                  src={bugPreview}
                                  className="image-preview d-block w-100 h-auto"
                                  alt="Bug Preview"
                                />
                              ) : (
                                <div>
                                  <i
                                    className="bi bi-cloud-arrow-up-fill"
                                    style={{ fontSize: '2.5rem' }}
                                  />
                                  <p className="mb-0 mt-2">
                                    Klik disini untuk mengunggah gambar
                                  </p>
                                  <small className="text-muted">
                                    (Format: JPG, PNG, WEBP)
                                  </small>
                                </div>
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>

                {/* Card 3: Informasi Kontak */}
                <Card className="mb-4 shadow-sm">
                  <Card.Header as="h5">
                    <i className="bi bi-person-lines-fill me-2" />
                    Informasi Kontak
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="firstName">
                          <Form.Label>
                            Nama Depan<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            name="first"
                            placeholder="cth: Raffi"
                            value={first}
                            onChange={(event) => setFirst(event.target.value)}
                            required
                            disabled={isBusy}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="lastName">
                          <Form.Label>Nama Belakang</Form.Label>
                          <Form.Control
                            name="last"
                            placeholder="cth: Ahmad"
                            value={last}
                            onChange={(event) => setLast(event.target.value)}
                            disabled={isBusy}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group controlId="email">
                          <Form.Label>
                            Email<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            name="email"
                            type="email"
                            placeholder="cth: raffi.ahmad@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            disabled={isBusy}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="d-grid gap-2 mt-4">
                  <div className="text-center">
                    <Form.Label>Verifikasi Keamanan</Form.Label>
                    <TurnstileWidget
                      key={turnstileKey}
                      siteKey={siteKey}
                      onToken={setTsToken}
                      className="mb-3 d-flex justify-content-center"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isFormReady || isBusy}
                  >
                    {isBusy ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2" />
                        Kirim Feedback
                      </>
                    )}
                  </Button>
                </div>
              </fetcher.Form>
            </div>
          </Col>
        </Row>

        <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Feedback Terkirim!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <div className="mb-3">
              <i
                className="bi bi-check-circle-fill text-success"
                style={{ fontSize: '3rem' }}
              />
            </div>
            <p>
              Terima kasih atas masukan Anda. Kami menghargai masukan yang Anda
              berikan dan akan menggunakannya untuk meningkatkan layanan kami.
            </p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button onClick={handleCloseAndRedirect}>OK</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
}
