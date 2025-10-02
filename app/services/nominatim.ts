import type { NominatimResponse } from '~/types';

async function getAddress(lat: string, lon: string): Promise<string> {
  try {
    const url = `/api/nominatim/reverse?lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: {
      display_name: string | null;
      error: string | null;
      raw: NominatimResponse;
    } = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.display_name || 'Alamat tidak ditemukan';
  } catch (e) {
    console.error(e);
    return 'Terjadi kesalahan saat mengambil alamat';
  }
}

export { getAddress };
