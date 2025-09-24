import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(async () => {
  await Promise.all([
    import("bootstrap/js/dist/dropdown"),
    import("bootstrap/js/dist/collapse"),
    import("bootstrap/js/dist/modal"),
  ]);

  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
