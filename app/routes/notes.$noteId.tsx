import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {assert} from 'smart-invariant';
import {Button} from '~/components/ui/button';
import {deleteNote, getNote} from '~/models/note.server';
import {requireUserId} from '~/models/session.server';

export async function loader({params, request}: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  assert(params.noteId, 'noteId not found');

  const note = await getNote({id: params.noteId, userId});
  if (!note) {
    throw new Response('Not Found', {status: 404});
  }
  return json({note});
}

export async function action({params, request}: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  assert(params.noteId, 'noteId not found');

  await deleteNote({id: params.noteId, userId});

  return redirect('/notes');
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-tight">
        {data.note.title}
      </h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <Button type="submit" variant="destructive">
          Delete
        </Button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
