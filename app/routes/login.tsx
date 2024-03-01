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
import Link from '~/components/Link';
import {Button} from '~/components/ui/button';
import {Checkbox} from '~/components/ui/checkbox';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {createUserSession, getUserId} from '~/models/session.server';
import {loginSchema} from '~/models/user.schema';
import {verifyLogin} from '~/models/user.server';
import {safeRedirect} from '~/utils';

export const meta: MetaFunction = () => [{title: 'Login'}];

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const remember = formData.get('remember');
  const submission = parseWithZod(formData, {schema: loginSchema});

  if (submission.status !== 'success') {
    return json(submission.reply(), {status: 400});
  }

  const user = await verifyLogin(
    submission.value.email,
    submission.value.password,
  );

  if (!user) {
    return json(
      submission.reply({
        fieldErrors: {
          email: ['Invalid email or password'],
        },
      }),
      {status: 400},
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === 'on' ? true : false,
    request,
    userId: user.id,
  });
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/notes';
  const lastResult = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({formData}) {
      return parseWithZod(formData, {schema: loginSchema});
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
              autoComplete="current-password"
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
            Log in
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Checkbox defaultChecked id="remember" name="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <p className="text-sm">
              Don't have an account?{' '}
              <Link
                to={{
                  pathname: '/join',
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
