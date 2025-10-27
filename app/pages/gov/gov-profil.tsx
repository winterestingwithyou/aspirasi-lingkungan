import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '~/context/auth-context';

type FormState = {
  name: string;
  username: string;
  email: string;
  departmentName: string;
  image: string;
};

const defaultFormState: FormState = {
  name: '',
  username: '',
  email: '',
  departmentName: '',
  image: '',
};

export default function GovProfil() {
  const { session, isLoading, client, refreshSession } = useAuth();
  const user = session?.user;

  const [form, setForm] = useState<FormState>(defaultFormState);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [imageInputError, setImageInputError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setForm(defaultFormState);
      setAvatarPreview(null);
      return;
    }

    const picture = user.image && user.image.trim() ? user.image : '';

    setForm({
      name: user.name ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      departmentName: user.departmentName ?? '',
      image: picture,
    });
    setAvatarPreview(picture || null);
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    const name = form.name.trim();
    const username = form.username.trim();
    const departmentName = form.departmentName.trim();

    if (!name || !username || !departmentName) {
      setErrorMessage('Nama, username, dan departemen harus diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const picture = form.image.trim();

    const payload: Record<string, unknown> = {
      name,
      username,
      departmentName,
      image: picture || null,
    };

    try {
      const response = await client.updateUser(payload);
      if ('error' in response && response.error) {
        setErrorMessage(
          response.error.message ?? 'Gagal memperbarui profil pengguna.',
        );
        return;
      }

      await refreshSession();
      setSuccessMessage('Profil berhasil diperbarui.');
    } catch (error) {
      console.error('Failed to update user profile', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenImageModal = () => {
    setImageInput(form.image ?? '');
    setImageInputError(null);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setImageInputError(null);
  };

  const isValidImageUrl = (value: string) => {
    if (!value) {
      return false;
    }
    if (value.startsWith('data:')) {
      return true;
    }
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSaveImage = () => {
    const trimmed = imageInput.trim();
    if (!isValidImageUrl(trimmed)) {
      setImageInputError('Masukkan URL gambar yang valid.');
      return;
    }

    setForm((prev) => ({
      ...prev,
      image: trimmed,
    }));
    setAvatarPreview(trimmed);
    handleCloseImageModal();
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      image: '',
    }));
    setAvatarPreview(null);
    setImageInput('');
    setImageInputError(null);
    handleCloseImageModal();
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Memuat data profil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-danger" role="alert">
        Data pengguna tidak ditemukan. Silakan masuk kembali.
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-4">Profil Pengguna</h2>

      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      ) : null}

      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={form.name || user.name || 'Profile'}
                className="profile-avatar"
                style={{
                  cursor: 'pointer',
                  border: '3px solid #2eaf60',
                  width: 120,
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
                onClick={handleOpenImageModal}
              />
            ) : (
              <div
                className="profile-avatar d-flex align-items-center justify-content-center bg-light text-secondary"
                style={{
                  cursor: 'pointer',
                  border: '3px solid #2eaf60',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  fontSize: 32,
                  fontWeight: 600,
                }}
                onClick={handleOpenImageModal}
              >
                {(form.name || user.name || '?').charAt(0).toUpperCase()}
              </div>
            )}

            <Button
              type="button"
              variant="light"
              size="sm"
              className="p-2"
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                border: '1px solid #ccc',
              }}
              onClick={handleOpenImageModal}
              title="Ganti Foto"
            >
              <i className="bi bi-camera"></i>
            </Button>
          </div>
          <h4 className="mt-3">{form.name || user.name || '-'}</h4>
          <p className="text-muted mb-0">
            {form.departmentName || user.departmentName || '-'}
          </p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Nama Lengkap</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                name="email"
                value={form.email}
                disabled
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Departemen</label>
              <input
                className="form-control"
                name="departmentName"
                value={form.departmentName}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </form>

      <Modal show={showImageModal} onHide={handleCloseImageModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Atur Foto Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>URL Foto Profil</Form.Label>
            <Form.Control
              value={imageInput}
              onChange={(event) => {
                setImageInput(event.target.value);
                setImageInputError(null);
              }}
              placeholder="https://contoh.com/foto-profil.jpg"
              autoFocus
              isInvalid={Boolean(imageInputError)}
            />
            <Form.Control.Feedback type="invalid">
              {imageInputError}
            </Form.Control.Feedback>
          </Form.Group>

          {imageInput.trim() && !imageInputError ? (
            <div className="text-center">
              <p className="text-muted">Pratinjau:</p>
              <img
                src={imageInput.trim()}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  borderRadius: 16,
                  border: '1px solid #e5e5e5',
                  padding: 8,
                }}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  setImageInputError('Tidak dapat memuat gambar dari URL ini.');
                }}
              />
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-danger"
            onClick={handleRemoveImage}
            disabled={!form.image && !imageInput.trim()}
          >
            Hapus Foto
          </Button>
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={handleCloseImageModal}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveImage}>
              Simpan
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
