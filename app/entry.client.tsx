import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import('bootstrap-icons/font/bootstrap-icons.css');
import('./app.css');
import('./bootstrap.css');
import('leaflet/dist/leaflet.css');

startTransition(async () => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
