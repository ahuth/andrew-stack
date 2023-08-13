import type {ActionArgs, LoaderArgs, V2_MetaFunction} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, Link, useActionData, useSearchParams} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import InputField from '~/components/InputField';
import {verifyLogin} from '~/models/user.server';
import {createUserSession, getUserId} from '~/session.server';
import {safeRedirect, validateEmail} from '~/utils';

export const meta: V2_MetaFunction = () => [{title: 'Login'}];

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
  const remember = formData.get('remember');

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

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      {errors: {email: 'Invalid email or password', password: null}},
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
            error={actionData?.errors.email}
            fieldLabel="Email address"
            id="email"
            name="email"
            ref={emailRef}
            required
            type="email"
          />

          <InputField
            autoComplete="current-password"
            error={actionData?.errors.password}
            fieldLabel="Password"
            id="password"
            name="password"
            ref={passwordRef}
            type="password"
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="btn btn-primary w-full">
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center sm:gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="checkbox-primary checkbox"
              />
              <label htmlFor="remember" className="label">
                <span className="label-text">Remember me</span>
              </label>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link
                className="link-primary link"
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
