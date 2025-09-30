import type { NominatimResponse } from '~/types';

export async function getAddress(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MyReactApp/1.0 (myemail@example.com)', // wajib
        },
      },
    );

    if (!res.ok) throw new Error('Gagal request ke Nominatim');

    const data: NominatimResponse = await res.json();
    return data.display_name || 'Alamat tidak ditemukan';
  } catch (err) {
    console.error(err);
    return 'Terjadi kesalahan saat mengambil alamat';
  }
}
