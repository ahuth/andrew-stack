import crypto from 'node:crypto';
import {
  createRequestHandler,
  type GetLoadContextFunction,
} from '@remix-run/express';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Augment Remix's AppLoadContext with our additions in `getLoadContext`.
declare module '@remix-run/server-runtime' {
  interface AppLoadContext {
    cspNonce: string;
  }
}

const app = express();
const port = Number(process.env.PORT) || 3000;

async function run() {
  setupMiddleware();
  await setupRequestHandlers();

  app.listen(port, () => {
    console.log(`✅ app ready: http://localhost:${port}`);
  });
}

run();

function setupMiddleware() {
  // /clean-urls/ -> /clean-urls
  app.use((req, res, next) => {
    if (req.path.endsWith('/') && req.path.length > 1) {
      const query = req.url.slice(req.path.length);
      const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
      res.redirect(301, safepath + query);
      return;
    }
    next();
  });

  app.use(morgan('tiny'));

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
}

async function setupRequestHandlers() {
  const viteDevServer =
    process.env.NODE_ENV === 'development'
      ? await import('vite').then((vite) =>
          vite.createServer({server: {middlewareMode: true}}),
        )
      : undefined;

  // Handle asset requests.
  if (viteDevServer) {
    app.use(viteDevServer.middlewares);
  } else {
    app.use(
      '/assets',
      express.static('build/client/assets', {immutable: true, maxAge: '1y'}),
    );
  }
  app.use(express.static('build/client', {maxAge: '1h'}));

  // Customize the LoadContext, which entry.server.tsx and loaders can access.
  const getLoadContext: GetLoadContextFunction = (_req, res) => {
    return {
      cspNonce: res.locals.cspNonce,
    };
  };

  // Handle SSR and data requests.
  app.all(
    '*',
    createRequestHandler({
      // @ts-ignore ssrLoadModule returns a generic object that is not currently compatible with
      // ServerBuild.
      build: viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
        : // @ts-ignore The server build may not exist, yet.
          await import('./build/server/index.js'),
      getLoadContext,
      mode: process.env.NODE_ENV,
    }),
  );
}
