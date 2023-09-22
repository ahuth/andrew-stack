import {PassThrough} from 'node:stream';
import {
  createReadableStreamFromReadable,
  type DataFunctionArgs,
  type EntryContext,
} from '@remix-run/node';
import {RemixServer} from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import isbot from 'isbot';
import {renderToPipeableStream} from 'react-dom/server';
import {NonceContext} from './utils/useNonce';

const ABORT_DELAY = 5_000;

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: any,
) {
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady';

  return new Promise((resolve, reject) => {
    const {pipe, abort} = renderToPipeableStream(
      <NonceContext.Provider value={loadContext?.cspNonce}>
        <RemixServer
          abortDelay={ABORT_DELAY}
          context={remixContext}
          url={request.url}
        />
      </NonceContext.Provider>,
      {
        [callbackName]() {
          const body = new PassThrough();

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export function handleError(error: unknown, {request}: DataFunctionArgs): void {
  if (error instanceof Error) {
    Sentry.captureRemixServerException(error, 'remix.server', request);
  } else {
    Sentry.captureException(error);
  }
}
