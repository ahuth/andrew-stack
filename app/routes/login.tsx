import {useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {Button, Checkbox, PasswordInput, TextInput} from '@mantine/core';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, useActionData, useSearchParams} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import Link from '~/components/Link';
import {createUserSession, getUserId} from '~/models/session.server';
import {loginSchema} from '~/models/user.schema';
import {verifyLogin} from '~/models/user.server';
import {safeRedirect} from '~/utils';

export const meta: MetaFunction = () => [{title: 'Login'}];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const remember = formData.get('remember');
  const submission = parse(formData, {schema: loginSchema});

  if (!submission.value) {
    return json(submission, {status: 400});
  }

  const user = await verifyLogin(
    submission.value.email,
    submission.value.password,
  );

  if (!user) {
    return json(
      {
        ...submission,
        error: {email: ['Invalid email or password']},
      },
      {status: 400},
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === 'on' ? true : false,
    request,
    userId: user.id,
  });
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/notes';
  const lastSubmission = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [form, fields] = useForm({
    lastSubmission,
    onValidate({formData}) {
      return parse(formData, {schema: loginSchema});
    },
  });

  useEffect(() => {
    if (fields.email.error) {
      emailRef.current?.focus();
    } else if (fields.password.error) {
      passwordRef.current?.focus();
    }
  }, [fields.email.error, fields.password.error]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form className="space-y-6" method="post" {...form.props}>
          <TextInput
            autoComplete="email"
            autoFocus
            error={fields.email.error}
            label="Email address"
            name="email"
            ref={emailRef}
            required
            type="email"
          />

          <PasswordInput
            autoComplete="current-password"
            error={fields.password.error}
            label="Password"
            name="password"
            ref={passwordRef}
            required
          />

          <input name="redirectTo" type="hidden" value={redirectTo} />

          <Button fullWidth type="submit">
            Log in
          </Button>

          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" name="remember" />
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link
                to={{
                  pathname: '/join',
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
