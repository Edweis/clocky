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
export default function Login() {
  const form = useForm<FromT>({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState<string | undefined>();
  const [loading, signIn] = useLoading(
    form.handleSubmit(async (data: FromT) => {
      console.log('clicked');
      setError(undefined);
      await Auth.signIn(data).catch((e) => setError(e.message));
    }),
  );
  return (
    <div className="h-[40vh] flex flex-col justify-center">
      <div className="grid gap-3 justify-center">
        <h2 className="text-xl text-center">Login</h2>
        <Input
          placeholder="Email"
          type="email"
          autoFocus
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
    </div>
  );
}
