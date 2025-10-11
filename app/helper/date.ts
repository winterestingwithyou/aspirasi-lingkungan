function formatDateToIndonesian(iso: string | Date, withTime = false) {
  try {
    const d = new Date(iso);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    if (withTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return d.toLocaleDateString('id-ID', options) + (withTime ? ' WIB' : '');
  } catch {
    return String(iso);
  }
}

function formatTanggal(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export { formatDateToIndonesian, formatTanggal };
