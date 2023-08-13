import {useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import type {ActionArgs, LoaderArgs, V2_MetaFunction} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, Link, useActionData, useSearchParams} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import InputField from '~/components/InputField';
import {loginSchema} from '~/models/user.schema';
import {createUser, getUserByEmail} from '~/models/user.server';
import {createUserSession, getUserId} from '~/session.server';
import {safeRedirect} from '~/utils';

export const meta: V2_MetaFunction = () => [{title: 'Sign Up'}];

export const loader = async ({request}: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({request}: ActionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const submission = parse(formData, {schema: loginSchema});

  if (!submission.value) {
    return json(submission, {status: 400});
  }

  const existingUser = await getUserByEmail(submission.value.email);

  if (existingUser) {
    return json(
      {
        error: {
          email: ['A user already exists with this email'],
          password: [],
        },
        intent: '',
        payload: {},
      },
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
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
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
          <InputField
            autoComplete="email"
            autoFocus
            error={fields.email.error}
            fieldLabel="Email address"
            name="email"
            ref={emailRef}
            required
            type="email"
          />

          <InputField
            autoComplete="new-password"
            error={fields.password.error}
            fieldLabel="Password"
            name="password"
            ref={passwordRef}
            type="password"
          />

          <input name="redirectTo" type="hidden" value={redirectTo} />
          <button className="btn btn-primary w-full normal-case" type="submit">
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link
                className="link-primary link"
                to={{
                  pathname: '/login',
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
