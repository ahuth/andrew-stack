import {useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {Button, Textarea, TextInput} from '@mantine/core';
import type {ActionFunctionArgs} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {noteSchema} from '~/models/note.schema';
import {createNote} from '~/models/note.server';
import {requireUserId} from '~/models/session.server';

export const action = async ({request}: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = parse(formData, {schema: noteSchema});

  if (!submission.value) {
    return json(submission, {status: 400});
  }

  const note = await createNote({
    body: submission.value.body,
    title: submission.value.title,
    userId,
  });

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const lastSubmission = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [form, fields] = useForm({
    lastSubmission,
    onValidate({formData}) {
      return parse(formData, {schema: noteSchema});
    },
  });

  useEffect(() => {
    if (fields.title.error) {
      titleRef.current?.focus();
    } else if (fields.body.error) {
      bodyRef.current?.focus();
    }
  }, [fields.title.error, fields.body.error]);

  return (
    <Form className="flex w-full flex-col gap-2" method="post" {...form.props}>
      <TextInput
        error={fields.title.error}
        label="Title"
        name="title"
        ref={titleRef}
        required
      />

      <Textarea
        error={fields.body.error}
        label="Body"
        name="body"
        ref={bodyRef}
        required
        rows={8}
      />

      <div className="text-right">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
