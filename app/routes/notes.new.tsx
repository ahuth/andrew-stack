import {useForm, getFormProps} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {json, redirect, type ActionFunctionArgs} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import z from 'zod';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {Textarea} from '~/components/ui/textarea';
import {createNote} from '~/models/note.server';
import {requireUserId} from '~/models/session.server';

const newFormSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export async function action({request}: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema: newFormSchema});

  if (submission.status !== 'success') {
    return json(submission.reply(), {status: 400});
  }

  const note = await createNote({
    body: submission.value.body,
    title: submission.value.title,
    userId,
  });

  return redirect(`/notes/${note.id}`);
}

export default function NewNotePage() {
  const lastResult = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({formData}) {
      return parseWithZod(formData, {schema: newFormSchema});
    },
  });

  useEffect(() => {
    if (!fields.title.valid) {
      titleRef.current?.focus();
    } else if (!fields.body.valid) {
      bodyRef.current?.focus();
    }
  }, [fields.title.valid, fields.body.valid]);

  return (
    <Form
      className="flex w-full flex-col gap-2"
      method="post"
      {...getFormProps(form)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          aria-describedby={!fields.title.valid ? 'title-error' : undefined}
          aria-invalid={!fields.title.valid ? true : undefined}
          id="title"
          name="title"
          ref={titleRef}
          required
        />
        {fields.title.errors && (
          <p className="text-sm text-red-600" id="title-error">
            {fields.title.errors[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          aria-describedby={!fields.body.valid ? 'body-error' : undefined}
          aria-invalid={!fields.body.valid ? true : undefined}
          id="body"
          name="body"
          ref={bodyRef}
          required
          rows={8}
        />
        {fields.body.errors && (
          <p className="text-sm text-red-600" id="body-error">
            {fields.body.errors[0]}
          </p>
        )}
      </div>

      <div className="text-right">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
