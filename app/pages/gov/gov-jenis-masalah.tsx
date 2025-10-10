import { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { Form as RemixForm, useActionData, useNavigation } from 'react-router';
import type { GovJenisMasalahLoaderData } from '~/routes/gov.jenis-masalah';

// Tipe data untuk jenis masalah
type JenisMasalah = {
  id: number;
  name: string;
  description: string | null;
};

export default function GovJenisMasalahPage({ problemTypes }: { problemTypes: JenisMasalah[] }) {
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<JenisMasalah | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    // Close modal on successful submission
    if (!isSubmitting && !actionData?.error && navigation.state === 'idle') {
      handleClose();
    }
  }, [navigation.state, isSubmitting, actionData]);

  // Menutup modal dan mereset form
  const handleClose = () => {
    setShowModal(false);
    setCurrentItem(null);
    setFormData({ name: '', description: '' });
  };

  // Menampilkan modal untuk menambah data baru
  const handleShowAdd = () => {
    setCurrentItem(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  // Menampilkan modal untuk mengedit data yang ada
  const handleShowEdit = (item: JenisMasalah) => {
    setCurrentItem(item);
    setFormData({ name: item.name, description: item.description ?? '' });
    setShowModal(true);
  };

  // Menangani perubahan pada input form
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as string }));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kelola Jenis Masalah</h2>
        <Button
          onClick={handleShowAdd}
          disabled={isSubmitting}
          className="btn-sm d-flex align-items-center"
        >
          <i className="bi bi-plus me-1"></i>
          <span className="text-nowrap">Tambah</span>
        </Button>
      </div>

      {actionData?.error && <div className="alert alert-danger">{actionData.error}</div>}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>No</th>
              <th style={{ width: '25%' }}>Jenis Masalah</th>
              <th>Deskripsi</th>
              <th style={{ width: '12%' }} className="text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {problemTypes.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleShowEdit(item)}
                      title="Edit"
                      className="me-2"
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-pencil-square text-primary"></i>
                    </Button>
                    <RemixForm method="post" onSubmit={(e) => !confirm('Apakah Anda yakin ingin menghapus jenis masalah ini?') && e.preventDefault()}>
                      <input type="hidden" name="_action" value="delete" />
                      <input type="hidden" name="id" value={item.id} />
                      <Button
                        variant="link"
                        size="sm"
                        type="submit"
                        title="Hapus"
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-trash-fill text-danger"></i>
                      </Button>
                    </RemixForm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal untuk Tambah/Edit */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? 'Edit Jenis Masalah' : 'Tambah Jenis Masalah'}
          </Modal.Title>
        </Modal.Header>
        <RemixForm method="post">
          <Modal.Body>
            <input type="hidden" name="_action" value={currentItem ? 'update' : 'create'} />
            {currentItem && <input type="hidden" name="id" value={currentItem.id} />}
            <Form.Group className="mb-3" controlId="formNama">
              <Form.Label>Jenis Masalah</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Contoh: Tumpukan Sampah"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDeskripsi">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Jelaskan secara singkat mengenai jenis masalah ini"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </Modal.Footer>
        </RemixForm>
      </Modal>
    </>
  );
}
