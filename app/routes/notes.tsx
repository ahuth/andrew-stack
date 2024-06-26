import {UserButton} from '@clerk/remix';
import {json, type LoaderFunctionArgs} from '@remix-run/node';
import {Link, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import clsx from 'clsx';
import {getNoteListItems} from '~/models/note.server';
import {requireUserId} from '~/models/session.server';

export async function loader(args: LoaderFunctionArgs) {
  const userId = await requireUserId(args);
  const noteListItems = await getNoteListItems({userId});
  return json({noteListItems});
}

export default function Notes() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4">
        <h1 className="text-4xl text-white">
          <Link to=".">Notes</Link>
        </h1>
        <UserButton />
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link className="block p-4 text-xl text-blue-600" to="new">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({isActive}) =>
                      clsx('block border-b p-4 text-xl', isActive && 'bg-white')
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
