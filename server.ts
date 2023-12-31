import crypto from 'node:crypto';
import path from 'node:path';
import {
  createRequestHandler,
  type GetLoadContextFunction,
} from '@remix-run/express';
import {broadcastDevReady} from '@remix-run/node';
import {watch} from 'chokidar';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const BUILD_DIR = path.join(process.cwd(), 'build');
const BUILD_VERSION_PATH = path.join(BUILD_DIR, 'version.txt');

app.use((req, res, next) => {
  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(301, safepath + query);
    return;
  }
  next();
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Generate a nonce for each request, which we'll use for CSP.
app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(32).toString('base64');
  next();
});

// Security-related HTTP response headers, such as content-security-policy (CSP) and
// strict-transport-security.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'connect-src': [
          process.env.NODE_ENV === 'development' ? 'ws:' : null,
          "'self'",
        ].filter(Boolean) as string[],
        'script-src': [
          "'strict-dynamic'",
          // @ts-expect-error Helmet types don't seem to know about res.locals
          (_, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
      },
    },
  }),
);

// Remix fingerprints its assets so we can cache forever.
app.use(
  '/build',
  express.static('public/build', {immutable: true, maxAge: '1y'}),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', {maxAge: '1h'}));

app.use(morgan('tiny'));

// Customize the LoadContext, which entry.server.tsx and loaders can access.
const getLoadContext: GetLoadContextFunction = (_req, res) => {
  return {
    cspNonce: res.locals.cspNonce,
  };
};

// Augment Remix's AppLoadContext with our additions in `getLoadContext`.
declare module '@remix-run/server-runtime' {
  interface AppLoadContext {
    cspNonce: string;
  }
}

app.all(
  '*',
  process.env.NODE_ENV === 'production'
    ? // In production, load the server files once (when the app first boots up).
      createRequestHandler({build: reimportServer(), getLoadContext})
    : // In development, load the server files again on every request.
      (...args) => {
        const requestHandler = createRequestHandler({
          build: reimportServer(),
          getLoadContext,
          mode: process.env.NODE_ENV,
        });
        return requestHandler(...args);
      },
);

const port = Number(process.env.PORT) || 3000;

startServer(port);

function startServer(port: number) {
  const server = app.listen(port, () => {
    // Load the built app so we're ready when the first request comes in.
    reimportServer();

    if (process.env.NODE_ENV === 'development') {
      // Watch the build directory and reload the server on any changes.
      watch(BUILD_VERSION_PATH).on('all', () => {
        const build = reimportServer();
        broadcastDevReady(build);
      });
    }

    console.log(`✅ app ready: http://localhost:${port}`);
  });

  process.on('SIGINT', () => server.close());
  process.on('SIGQUIT', () => server.close());
  process.on('SIGTERM', () => server.close());
}

function reimportServer() {
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
  return require(BUILD_DIR);
}
