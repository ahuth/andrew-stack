import {useForm, getFormProps} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Typography,
} from '@mui/joy';
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
import {createUserSession, getUserId} from '~/models/session.server';
import {loginSchema} from '~/models/user.schema';
import {createUser, getUserByEmail} from '~/models/user.server';
import {safeRedirect} from '~/utils';

export const meta: MetaFunction = () => [{title: 'Sign Up'}];

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const submission = parseWithZod(formData, {schema: loginSchema});

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
          <FormControl error={!fields.email.valid}>
            <FormLabel>Email address</FormLabel>
            <Input
              autoComplete="email"
              autoFocus
              name="email"
              ref={emailRef}
              required
              type="email"
            />
            {fields.email.errors && (
              <FormHelperText>{fields.email.errors[0]}</FormHelperText>
            )}
          </FormControl>

          <FormControl error={!fields.password.valid}>
            <FormLabel>Password</FormLabel>
            <Input
              autoComplete="new-password"
              name="password"
              ref={passwordRef}
              required
              type="password"
            />
            {fields.password.errors && (
              <FormHelperText>{fields.password.errors[0]}</FormHelperText>
            )}
          </FormControl>

          <input name="redirectTo" type="hidden" value={redirectTo} />

          <Button fullWidth type="submit">
            Create Account
          </Button>

          <div className="flex items-center justify-center">
            <div className="text-center text-sm">
              <Typography level="body-sm">
                Already have an account?{' '}
                <Link
                  to={{
                    pathname: '/login',
                    search: searchParams.toString(),
                  }}
                >
                  Log in
                </Link>
              </Typography>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
