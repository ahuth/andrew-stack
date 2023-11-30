import {Button, Typography} from '@mui/joy';
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
            <Button component={Link} to="/notes" variant="outlined">
              View notes
            </Button>
          ) : (
            <>
              <Button component={Link} to="/join" variant="outlined">
                Sign up
              </Button>
              <Button component={Link} to="/login" variant="solid">
                Log in
              </Button>
            </>
          )}
        </div>
      </nav>
      <main className="mx-auto max-w-3xl py-12 sm:py-24">
        <Typography className="!text-6xl sm:text-center" level="h1">
          Keep track of notes...
        </Typography>
        <Typography className="!mt-6 sm:text-center" level="body-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
      </main>
    </div>
  );
}
