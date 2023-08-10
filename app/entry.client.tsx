import {RemixBrowser} from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

if (window.ENV?.SENTRY_DSN) {
  Sentry.init({
    dsn: window.ENV.SENTRY_DSN,
    environment: window.ENV.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
