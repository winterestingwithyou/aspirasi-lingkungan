import 'bootstrap-icons/font/bootstrap-icons.css';
import './app.css';
import './app.scss';

import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

startTransition(async () => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
