import type { CloudinarySign } from '~/types';

async function getCloudinarySignature(): Promise<CloudinarySign> {
  const res = await fetch('/api/cloudinary/sign');
  if (!res.ok) throw new Error('Gagal mengambil tanda-tangan Cloudinary');
  return res.json();
}

async function uploadToCloudinary(file: File): Promise<string> {
  const { cloudName, apiKey, folder, timestamp, signature } =
    await getCloudinarySignature();

  const form = new FormData();
  form.append('file', file);

  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Upload Cloudinary gagal: ${t || res.status}`);
  }
  const json = await res.json();
  return json.secure_url as string;
}

export { uploadToCloudinary, getCloudinarySignature };
