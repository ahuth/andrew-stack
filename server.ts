import crypto from 'node:crypto';
import path from 'node:path';
import type {GetLoadContextFunction} from '@remix-run/express';
import {createRequestHandler as expressCreateRequestHandler} from '@remix-run/express';
import {wrapExpressCreateRequestHandler} from '@sentry/remix';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const BUILD_DIR = path.join(process.cwd(), 'build');

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
          (_, res) => `'nonce-${res.locals.cspNonce}`,
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

const createRequestHandler = process.env.SENTRY_DSN
  ? wrapExpressCreateRequestHandler(expressCreateRequestHandler)
  : expressCreateRequestHandler;

const getLoadContext: GetLoadContextFunction = (req, res) => {
  return {
    cspNonce: res.locals.cspNonce,
  };
};

app.all(
  '*',
  process.env.NODE_ENV === 'production'
    ? createRequestHandler({build: require(BUILD_DIR), getLoadContext})
    : (...args) => {
        purgeRequireCache();
        const requestHandler = createRequestHandler({
          build: require(BUILD_DIR),
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
    // Require the built app so we're ready when the first request comes in.
    require(BUILD_DIR);
    console.log(`✅ app ready: http://localhost:${port}`);
  });

  process.on('SIGINT', () => server.close());
  process.on('SIGQUIT', () => server.close());
  process.on('SIGTERM', () => server.close());
}

/**
 * Purge the require cache so we can reload any files that have changed. Gives us a sort of
 * "server-side HMR".
 *
 * Alternatively we could use nodemon to restart the server automagically when files change, or run
 * `remix dev` without the `--no-restart` flag.
 *
 * However, purging the cache (instead of restarting) seems to give us the best dev experience
 * right now. Revisit as Remix updates its dev server.
 */
function purgeRequireCache() {
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
