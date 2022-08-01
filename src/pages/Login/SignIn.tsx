import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Auth } from '@aws-amplify/auth';
import { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useLoading from '../../lib/use-loading';

const schema = yup
  .object({
    username: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();
type FromT = yup.InferType<typeof schema>;
export default function SignIn() {
  const form = useForm<FromT>({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState<string | undefined>();
  const [loading, signIn] = useLoading(
    form.handleSubmit(
      async (data: FromT) =>
        new Promise<void>((res) => {
          setTimeout(() => {
            Auth.signIn(data)
              .catch((e) => setError(e.message))
              .then(res);
          }, 10); // signIn has a lot of computation which defers the rendering. We use a small timeout to prioritize the rendering over the expensive computation
        }),
    ),
  );
  return (
    <div className="grid gap-3 justify-center">
      <Input
        placeholder="Email"
        type="email"
        inputMode="email"
        {...form.register('username')}
        errorMessage={form.formState.errors.username?.message}
      />
      <Input
        placeholder="Password"
        type="password"
        {...form.register('password')}
        errorMessage={form.formState.errors.password?.message}
      />
      <Button onClick={signIn} loading={loading}>
        Sign In
      </Button>
      {error && <div className="text-red-700">{error}</div>}
    </div>
  );
}
