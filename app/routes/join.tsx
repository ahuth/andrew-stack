import {useForm, getFormProps} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import {Form, useActionData, useSearchParams} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import z from 'zod';
import Link from '~/components/Link';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {createUserSession, getUserId} from '~/models/session.server';
import {createUser, getUserByEmail} from '~/models/user.server';
import {safeRedirect} from '~/utils';

const joinFormSchema = z.object({
  email: z
    .string({required_error: 'Email is required'})
    .email({message: 'Email is invalid'}),
  password: z.string({required_error: 'Password is required'}),
});

export const meta: MetaFunction = () => [{title: 'Sign Up'}];

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const submission = parseWithZod(formData, {schema: joinFormSchema});

  if (submission.status !== 'success') {
    return json(submission.reply(), {status: 400});
  }

  const existingUser = await getUserByEmail(submission.value.email);

  if (existingUser) {
    return json(
      submission.reply({
        fieldErrors: {
          email: ['A user already exists with this email'],
        },
      }),
      {status: 400},
    );
  }

  const user = await createUser(
    submission.value.email,
    submission.value.password,
  );

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
}

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
  const lastResult = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({formData}) {
      return parseWithZod(formData, {schema: joinFormSchema});
    },
  });

  useEffect(() => {
    if (!fields.email.valid) {
      emailRef.current?.focus();
    } else if (!fields.password.valid) {
      passwordRef.current?.focus();
    }
  }, [fields.email.valid, fields.password.valid]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form className="space-y-6" method="post" {...getFormProps(form)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              aria-describedby={!fields.email.valid ? 'email-error' : undefined}
              aria-invalid={!fields.email.valid ? true : undefined}
              autoComplete="email"
              autoFocus
              id="email"
              name="email"
              ref={emailRef}
              required
              type="email"
            />
            {fields.email.errors && (
              <p className="text-sm text-red-600" id="email-error">
                {fields.email.errors[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              aria-describedby={
                !fields.password.valid ? 'password-error' : undefined
              }
              aria-invalid={!fields.password.valid ? true : undefined}
              autoComplete="new-password"
              id="password"
              name="password"
              ref={passwordRef}
              required
              type="password"
            />
            {fields.password.errors && (
              <p className="text-sm text-red-600" id="password-error">
                {fields.password.errors[0]}
              </p>
            )}
          </div>

          <input name="redirectTo" type="hidden" value={redirectTo} />

          <Button className="w-full" type="submit">
            Create Account
          </Button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link
              to={{
                pathname: '/login',
                search: searchParams.toString(),
              }}
            >
              Log in
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
