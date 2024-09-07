import type {MetaFunction} from '@remix-run/node';
import {Link} from '@remix-run/react';
import {Button} from '~/components/ui/button';
import {useOptionalUser} from '~/utils';

export const meta: MetaFunction = () => [{title: 'Remix Notes'}];

export default function Index() {
  const user = useOptionalUser();
  return (
    <div>
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between px-2 pt-6 sm:px-6">
        <Link className="!text-4xl !no-underline" to="/">
          😺 <span className="hidden sm:inline">Notes</span>
        </Link>
        <div className="flex gap-4">
          {user ? (
            <Button asChild variant="outline">
              <Link to="/notes">View notes</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/join">Sign up</Link>
              </Button>
              <Button asChild variant="default">
                <Link to="/login">Log in</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      <main className="mx-auto max-w-3xl py-12 sm:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-center lg:text-5xl">
          Keep track of notes...
        </h1>
        <p className="mt-6 sm:text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </main>
    </div>
  );
}
