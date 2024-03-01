import {useForm, getFormProps} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
} from '@mui/joy';
import {json, redirect, type ActionFunctionArgs} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {noteSchema} from '~/models/note.schema';
import {createNote} from '~/models/note.server';
import {requireUserId} from '~/models/session.server';

export async function action({request}: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema: noteSchema});

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
  const bodyRef = useRef<HTMLDivElement>(null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({formData}) {
      return parseWithZod(formData, {schema: noteSchema});
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
      <FormControl error={!fields.title.valid}>
        <FormLabel>Title</FormLabel>
        <Input name="title" ref={titleRef} required />
        {fields.title.errors && (
          <FormHelperText>{fields.title.errors[0]}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!fields.body.valid}>
        <FormLabel>Body</FormLabel>
        <Textarea minRows={8} name="body" ref={bodyRef} required />
        {fields.body.errors && (
          <FormHelperText>{fields.body.errors[0]}</FormHelperText>
        )}
      </FormControl>

      <div className="text-right">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
