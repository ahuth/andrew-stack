import {getAuth} from '@clerk/remix/ssr.server';
import {redirect, type LoaderFunctionArgs} from '@remix-run/node';
import {assert} from 'smart-invariant';

assert(process.env.CLERK_SIGN_IN_URL, 'CLERK_SIGN_IN_URL env var not set');

const signInUrl = process.env.CLERK_SIGN_IN_URL;

export async function requireUserId(
  args: LoaderFunctionArgs,
  redirectTo: string = args.request.url,
) {
  const {userId} = await getAuth(args);
  if (!userId) {
    const searchParams = new URLSearchParams([['redirect_url', redirectTo]]);
    throw redirect(`${signInUrl}?${searchParams}`);
  }
  return userId;
}
