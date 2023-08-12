import type {ActionArgs} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import InputField from '~/components/InputField';
import {createNote} from '~/models/note.server';
import {requireUserId} from '~/session.server';

export const action = async ({request}: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get('title');
  const body = formData.get('body');

  if (typeof title !== 'string' || title.length === 0) {
    return json(
      {errors: {body: null, title: 'Title is required'}},
      {status: 400},
    );
  }

  if (typeof body !== 'string' || body.length === 0) {
    return json(
      {errors: {body: 'Body is required', title: null}},
      {status: 400},
    );
  }

  const note = await createNote({body, title, userId});

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
      }}
    >
      <InputField
        error={actionData?.errors?.title}
        inputLabel="Title"
        inputRef={titleRef}
      />

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? 'body-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.body ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </Form>
  );
}
