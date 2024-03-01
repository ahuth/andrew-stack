import {useForm, getFormProps} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {
  Button,
  Checkbox,
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
              autoComplete="current-password"
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
            Log in
          </Button>

          <div className="flex items-center justify-between">
            <Checkbox
              defaultChecked
              label="Remember me"
              name="remember"
              size="sm"
            />
            <div>
              <Typography level="body-sm">
                Don't have an account?{' '}
                <Link
                  to={{
                    pathname: '/join',
                    search: searchParams.toString(),
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
