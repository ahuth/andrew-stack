import {MantineProvider, ColorSchemeScript} from '@mantine/core';
import {cssBundleHref} from '@remix-run/css-bundle';
import type {LinksFunction, LoaderFunctionArgs} from '@remix-run/node';
import {json} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import theme from './theme';
import {getUser} from '~/models/session.server';
import tailwind from '~/tailwind.css';
import {useNonce} from '~/utils/useNonce';
import '@mantine/core/styles.css';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: tailwind},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {NODE_ENV} = process.env;

  return json({
    user: await getUser(request),
    ENV: {
      GIT_COMMIT: process.env.GIT_COMMIT,
      NODE_ENV,
    },
  });
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();

  return (
    <html className="h-full" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <meta content={data.ENV.GIT_COMMIT || 'unknown'} name="version" />
        <Meta />
        <Links />
        <ColorSchemeScript nonce={nonce} />
      </head>
      <body className="h-full">
        <MantineProvider theme={theme}>
          <Outlet />
        </MantineProvider>
        <ScrollRestoration nonce={nonce} />
        <script
          // Pass environment data from the server to the client. Keep the global.d.ts types in
          // sync with this.
          //
          // Using `dangerouslySetInnerHTML` bypasses React's XSS protection, so don't pass user
          // input into here.
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
          nonce={nonce}
        />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}
