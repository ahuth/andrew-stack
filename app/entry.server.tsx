import {PassThrough} from 'node:stream';
import {
  createReadableStreamFromReadable,
  type AppLoadContext,
  type EntryContext,
} from '@remix-run/node';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToPipeableStream} from 'react-dom/server';
import {NonceContext} from './utils/useNonce';

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
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
        nonce: loadContext?.cspNonce,
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
