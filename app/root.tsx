import {ClerkApp} from '@clerk/remix';
import {rootAuthLoader} from '@clerk/remix/ssr.server';
import {json, type LoaderFunctionArgs} from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import {useNonce} from '~/utils/useNonce';
import '@fontsource/inter/index.css';
import '~/tailwind.css';

export function loader(args: LoaderFunctionArgs) {
  return rootAuthLoader(args, () => {
    const {NODE_ENV} = process.env;

    return json({
      ENV: {
        GIT_COMMIT: process.env.GIT_COMMIT,
        NODE_ENV,
      },
    });
  });
}

function App() {
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

export default ClerkApp(App);
