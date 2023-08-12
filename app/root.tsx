import {cssBundleHref} from '@remix-run/css-bundle';
import type {LinksFunction, LoaderArgs} from '@remix-run/node';
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
import {withSentry} from '@sentry/remix';
import {getUser} from '~/session.server';
import stylesheet from '~/tailwind.css';
import {useNonce} from '~/utils/useNonce';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: stylesheet},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export const loader = async ({request}: LoaderArgs) => {
  const {NODE_ENV, SENTRY_DSN} = process.env;

  return json({
    user: await getUser(request),
    ENV: {
      NODE_ENV,
      SENTRY_DSN,
    },
  });
};

export default withSentry(App);

function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
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
