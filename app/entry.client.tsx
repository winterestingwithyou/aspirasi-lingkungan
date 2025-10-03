import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

startTransition(async () => {
  await import('bootstrap-icons/font/bootstrap-icons.css');
  await import('./app.css');
  await import('./bootstrap.css');
  await import('leaflet/dist/leaflet.css');

  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
