import {Button, Title} from '@mantine/core';
import type {MetaFunction} from '@remix-run/node';
import {Link} from '@remix-run/react';
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
            <Button component={Link} to="/notes" variant="outline">
              View notes
            </Button>
          ) : (
            <>
              <Button component={Link} to="/join" variant="outline">
                Sign up
              </Button>
              <Button component={Link} to="/login" variant="filled">
                Log in
              </Button>
            </>
          )}
        </div>
      </nav>
      <main className="mx-auto max-w-3xl py-12 sm:py-24">
        <Title className="sm:text-center" order={1}>
          Keep track of notes...
        </Title>
        <p className="mt-6 text-lg text-slate-600 sm:text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </main>
    </div>
  );
}
