import { useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';

export default function KontakPage() {
  const navigate = useNavigate();

  const [type, setType] = useState<'bugs' | 'questions' | 'comments' | ''>('');
  const [feedback, setFeedback] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [bugFile, setBugFile] = useState<File | null>(null);
  const [bugPreview, setBugPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBugFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setBugPreview(String(ev.target?.result || ''));
    reader.readAsDataURL(f);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // TODO: Kirim data form ke server di sini
    setShowSuccess(true);
    setType('');
    setFeedback('');
    setFirst('');
    setLast('');
    setEmail('');
    setBugFile(null);
    setBugPreview(null);
  };

  const handleCloseAndRedirect = () => {
    setShowSuccess(false);
    navigate('/');
  };

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
              <Form onSubmit={onSubmit}>
                {/* Card 1: Jenis Feedback */}
                <Card className="mb-4 shadow-sm">
                  <Card.Header as="h5">
                    <i className="bi bi-tags-fill me-2" />
                    Jenis Feedback<span className="text-danger">*</span>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group>
                      <div className="d-flex flex-wrap gap-3">
                        <Form.Check type="radio" label="Lapor Bug/Error" name="type" id="type-bugs" value="bugs" checked={type === 'bugs'} onChange={() => setType('bugs')} required />
                        <Form.Check type="radio" label="Pertanyaan" name="type" id="type-questions" value="questions" checked={type === 'questions'} onChange={() => setType('questions')} required />
                        <Form.Check type="radio" label="Komentar/Saran" name="type" id="type-comments" value="comments" checked={type === 'comments'} onChange={() => setType('comments')} required />
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
                        <Form.Group>
                          <Form.Label>Pesan<span className="text-danger">*</span></Form.Label>
                          <Form.Control as="textarea" rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tuliskan pesan, pertanyaan, atau deskripsi bug Anda di sini..." required />
                        </Form.Group>
                      </Col>
                      {type === 'bugs' && (
                        <Col xs={12}>
                          <Form.Label>Screenshot Bug <span className="text-muted">(Opsional)</span></Form.Label>
                          <Form.Group
                            controlId="bugFile"
                            className="file-upload-area text-center p-4"
                            onClick={() => document.getElementById('bug-file-input')?.click()}
                          >
                            <Form.Control id="bug-file-input" type="file" accept="image/*" onChange={onFile} hidden />
                            {bugPreview ? (
                              <img src={bugPreview} className="image-preview d-block w-100 h-auto" alt="Bug Preview" />
                            ) : (
                              <div>
                                <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '2.5rem' }} />
                                <p className="mb-0 mt-2">Klik disini untuk mengunggah gambar</p>
                                <small className="text-muted">(Format: JPG, PNG, WEBP)</small>
                              </div>
                            )}
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
                        <Form.Group>
                          <Form.Label>Nama Depan<span className="text-danger">*</span></Form.Label>
                          <Form.Control placeholder="cth: Raffi" value={first} onChange={(e) => setFirst(e.target.value)} required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Nama Belakang</Form.Label>
                          <Form.Control placeholder="cth: Ahmad" value={last} onChange={(e) => setLast(e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                          <Form.Control type="email" placeholder="cth: raffi.ahmad@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="d-grid gap-2 mt-4">
                  <Button type="submit" size="lg">
                    <i className="bi bi-send-fill me-2" />
                    Kirim Feedback
                  </Button>
                </div>
              </Form>
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
              Terima kasih atas masukan Anda. Kami menghargai masukan yang Anda berikan dan akan menggunakannya untuk meningkatkan layanan kami.
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