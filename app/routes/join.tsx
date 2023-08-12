import type {ActionArgs, LoaderArgs, V2_MetaFunction} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, Link, useActionData, useSearchParams} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import InputField from '~/components/InputField';
import {createUser, getUserByEmail} from '~/models/user.server';
import {createUserSession, getUserId} from '~/session.server';
import {safeRedirect, validateEmail} from '~/utils';

export const meta: V2_MetaFunction = () => [{title: 'Sign Up'}];

export const loader = async ({request}: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({request}: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');

  if (!validateEmail(email)) {
    return json(
      {errors: {email: 'Email is invalid', password: null}},
      {status: 400},
    );
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      {errors: {email: null, password: 'Password is required'}},
      {status: 400},
    );
  }

  if (password.length < 8) {
    return json(
      {errors: {email: null, password: 'Password is too short'}},
      {status: 400},
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: 'A user already exists with this email',
          password: null,
        },
      },
      {status: 400},
    );
  }

  const user = await createUser(email, password);

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
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <InputField
            autoComplete="email"
            autoFocus
            id="email"
            inputLabel="Email address"
            inputRef={emailRef}
            name="email"
            required
            type="email"
          />

          <InputField
            autoComplete="current-password"
            id="password"
            inputLabel="Password"
            inputRef={passwordRef}
            name="new-password"
            type="password"
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="btn btn-primary w-full">
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
