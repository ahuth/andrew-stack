import {useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
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
}

export default function NewNotePage() {
  const lastSubmission = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

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
      <FormControl error={!!fields.title.error}>
        <FormLabel>Title</FormLabel>
        <Input name="title" ref={titleRef} required />
        {fields.title.error && (
          <FormHelperText>{fields.title.error}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!fields.body.error}>
        <FormLabel>Body</FormLabel>
        <Textarea minRows={8} name="body" ref={bodyRef} required />
        {fields.body.error && (
          <FormHelperText>{fields.body.error}</FormHelperText>
        )}
      </FormControl>

      <div className="text-right">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
