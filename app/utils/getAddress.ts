import axios from 'axios';
import type { NominatimResponse } from '~/types';

async function getAddress(lat: number, lon: number): Promise<string> {
  try {
    const res = await axios.get<NominatimResponse>(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat,
          lon,
          format: 'json',
        },
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MyReactApp/1.0 (myemail@example.com)', // wajib
        },
      },
    );

    return res.data.display_name || 'Alamat tidak ditemukan';
  } catch (err) {
    console.error(err);
    return 'Terjadi kesalahan saat mengambil alamat';
  }
}

export { getAddress };
