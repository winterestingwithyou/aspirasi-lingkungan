import { useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';

export default function KontakPage() {
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
    setShowSuccess(true);
    setType('');
    setFeedback('');
    setFirst('');
    setLast('');
    setEmail('');
    setBugFile(null);
    setBugPreview(null);
  };

  return (
    <section className="page-section">
      <Container>
        <div className="text-center mb-5 mt-3">
          <h2 className="section-title">Form Feedback</h2>
          <p className="lead">Kami siap untuk mendengarkan pendapatmu</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="form-container mt-0">
              <Form onSubmit={onSubmit}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Label as="legend" className="fw-semibold">
                      Tipe<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="d-flex gap-4 mb-2">
                      <Form.Check
                        type="radio"
                        label="Bug"
                        name="type"
                        id="type-bugs"
                        value="bugs"
                        checked={type === 'bugs'}
                        onChange={() => setType('bugs')}
                        required
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
                      />
                      <Form.Check
                        type="radio"
                        label="Komentar"
                        name="type"
                        id="type-comments"
                        value="comments"
                        checked={type === 'comments'}
                        onChange={() => setType('comments')}
                        required
                      />
                    </div>
                  </Col>
                  {type === 'bugs' && (
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>
                          Upload Screenshot <span className="text-muted">(optional)</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={onFile}
                        />
                        {bugPreview && (
                          <img
                            src={bugPreview}
                            className="image-preview d-block my-2"
                            alt="Bug Preview"
                            style={{ maxWidth: 200 }}
                          />
                        )}
                      </Form.Group>
                    </Col>
                  )}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Pesan<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nama<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        placeholder="First"
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="invisible">Last</Form.Label>
                      <Form.Control
                        placeholder="Last"
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="boy.reva@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="text-center mt-4">
                    <Button type="submit" size="lg" variant="dark">
                      Kirim Feedback
                    </Button>
                  </Col>
                </Row>
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
              Thank you for your feedback. We appreciate your input and will use it to improve our service.
            </p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button onClick={() => setShowSuccess(false)}>OK</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
}