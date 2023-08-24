import {useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import type {ActionArgs} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import InputField from '~/components/InputField';
import TextAreaField from '~/components/TextAreaField';
import {noteSchema} from '~/models/note.schema';
import {createNote} from '~/models/note.server';
import {requireUserId} from '~/models/session.server';

export const action = async ({request}: ActionArgs) => {
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
      <InputField
        error={fields.title.error}
        fieldLabel="Title"
        name="title"
        ref={titleRef}
        required
      />

      <TextAreaField
        error={fields.body.error}
        fieldLabel="Body"
        name="body"
        ref={bodyRef}
        required
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
