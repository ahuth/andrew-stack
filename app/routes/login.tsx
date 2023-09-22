import {useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, Link, useActionData, useSearchParams} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import InputField from '~/components/InputField';
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
        error: {email: ['Invalid email or password'], password: []},
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
          <InputField
            autoComplete="email"
            autoFocus
            domRef={emailRef}
            error={fields.email.error}
            fieldLabel="Email address"
            name="email"
            required
            type="email"
          />

          <InputField
            autoComplete="current-password"
            domRef={passwordRef}
            error={fields.password.error}
            fieldLabel="Password"
            name="password"
            required
            type="password"
          />

          <input name="redirectTo" type="hidden" value={redirectTo} />
          <button className="btn btn-primary w-full normal-case" type="submit">
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center sm:gap-2">
              <input
                className="checkbox-primary checkbox"
                id="remember"
                name="remember"
                type="checkbox"
              />
              <label className="label" htmlFor="remember">
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
