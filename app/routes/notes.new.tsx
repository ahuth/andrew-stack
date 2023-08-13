import type {ActionArgs} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import InputField from '~/components/InputField';
import TextAreaField from '~/components/TextAreaField';
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
        fieldLabel="Title"
        name="title"
        ref={titleRef}
      />

      <TextAreaField
        error={actionData?.errors.body}
        fieldLabel="Body"
        name="body"
        ref={bodyRef}
        rows={8}
      />

      <div className="text-right">
        <button className="btn btn-primary normal-case" type="submit">
          Save
        </button>
      </div>
    </Form>
  );
}
