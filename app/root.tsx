import {json, type LoaderFunctionArgs} from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import {getUser} from '~/models/session.server';
import {useNonce} from '~/utils/useNonce';
import '@fontsource/inter/index.css';
import '~/tailwind.css';

export async function loader({request}: LoaderFunctionArgs) {
  const {NODE_ENV} = process.env;

  return json({
    user: await getUser(request),
    ENV: {
      GIT_COMMIT: process.env.GIT_COMMIT,
      NODE_ENV,
    },
  });
}

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
      </body>
    </html>
  );
}
