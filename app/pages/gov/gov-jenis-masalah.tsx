import { useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';

// Tipe data untuk jenis masalah
type JenisMasalah = {
  id: number;
  nama: string;
  deskripsi: string;
};

// Data awal (mock data)
const initialData: JenisMasalah[] = [
  {
    id: 1,
    nama: 'Tumpukan Sampah Liar',
    deskripsi: 'Laporan terkait tumpukan sampah di lokasi yang tidak semestinya.',
  },
  {
    id: 2,
    nama: 'Saluran Air Tersumbat',
    deskripsi: 'Laporan terkait drainase atau selokan yang mampet dan berpotensi menyebabkan banjir.',
  },
  {
    id: 3,
    nama: 'Penebangan Liar',
    deskripsi: 'Aktivitas penebangan pohon tanpa izin resmi dari pihak berwenang.',
  },
];

export default function GovJenisMasalahPage() {
  const [data, setData] = useState<JenisMasalah[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<JenisMasalah | null>(null);
  const [formData, setFormData] = useState({ nama: '', deskripsi: '' });

  // Menutup modal dan mereset form
  const handleClose = () => {
    setShowModal(false);
    setCurrentItem(null);
    setFormData({ nama: '', deskripsi: '' });
  };

  // Menampilkan modal untuk menambah data baru
  const handleShowAdd = () => {
    setCurrentItem(null);
    setFormData({ nama: '', deskripsi: '' });
    setShowModal(true);
  };

  // Menampilkan modal untuk mengedit data yang ada
  const handleShowEdit = (item: JenisMasalah) => {
    setCurrentItem(item);
    setFormData({ nama: item.nama, deskripsi: item.deskripsi });
    setShowModal(true);
  };

  // Menangani perubahan pada input form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Menyimpan data (baik tambah baru maupun edit)
  const handleSave = () => {
    if (currentItem) {
      // Edit data
      setData(data.map((item) =>
        item.id === currentItem.id ? { ...item, ...formData } : item
      ));
    } else {
      // Tambah data baru
      const newItem: JenisMasalah = {
        id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
        ...formData,
      };
      setData([...data, newItem]);
    }
    handleClose();
  };

  // Menghapus data
  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jenis masalah ini?')) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kelola Jenis Masalah</h2>
        <Button onClick={handleShowAdd}>
          <i className="bi bi-plus-lg me-2"></i>
          Tambah Jenis Masalah
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>No</th>
              <th style={{ width: '25%' }}>Jenis Masalah</th>
              <th>Deskripsi</th>
              <th style={{ width: '10%' }} className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama}</td>
                <td>{item.deskripsi}</td>
                <td className="text-center">
                  <Button variant="link" size="sm" onClick={() => handleShowEdit(item)} title="Edit" className="me-2">
                    <i className="bi bi-pencil-square text-primary"></i>
                  </Button>
                  <Button variant="link" size="sm" onClick={() => handleDelete(item.id)} title="Hapus" >
                    <i className="bi bi-trash-fill text-danger"></i>
                  </Button>
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
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNama">
              <Form.Label>Jenis Masalah</Form.Label>
              <Form.Control
                type="text"
                name="nama"
                value={formData.nama}
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
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleFormChange}
                placeholder="Jelaskan secara singkat mengenai jenis masalah ini"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Batal</Button>
          <Button variant="primary" onClick={handleSave}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}