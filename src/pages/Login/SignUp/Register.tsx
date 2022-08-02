import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Auth } from '@aws-amplify/auth';
import { useState } from 'react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import useLoading from '../../../lib/use-loading';

const schema = yup
  .object({
    username: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required(),
  })
  .required();

type FormT = yup.InferType<typeof schema>;
export default function Register(props: {
  onSubmit: (username: string) => void;
}) {
  const form = useForm<FormT>({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState<string | undefined>();
  const [loading, signUp] = useLoading(
    form.handleSubmit((data) =>
      Auth.signUp({
        username: data.username,
        password: data.password,
        attributes: { email: data.username },
        autoSignIn: { enabled: true },
      })
        .then(() => props.onSubmit(data.username))
        .catch((e) => setError(e.message)),
    ),
  );
  console.log({ error, loading });
  return (
    <div className="grid gap-3">
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
      <Input
        placeholder="Verify Passsword"
        type="password"
        {...form.register('confirmation')}
        errorMessage={form.formState.errors.confirmation?.message}
      />
      <Button onClick={signUp} loading={loading}>
        Send me the link
      </Button>
      {error && <div className="text-red-700">{error}</div>}
    </div>
  );
}
