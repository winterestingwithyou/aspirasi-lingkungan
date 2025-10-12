function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        m
      ]!,
  );
}

function nl2br(s: string) {
  return s.replace(/\n/g, '<br/>');
}

export { escapeHtml, nl2br };
