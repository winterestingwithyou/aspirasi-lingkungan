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

export { formatDateToIndonesian };
