import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Auth } from '@aws-amplify/auth';
import { useState } from 'react';
import { Router, useNavigate, useRoutes } from 'react-router-dom';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import useLoading from '../../../lib/use-loading';
import { useAuth } from '../../../lib/auth';

const schema = yup
  .object({ code: yup.string().min(6).max(6).required() })
  .required();

type FormT = yup.InferType<typeof schema>;
export default function Challenge(props: {
  username: string;
  onSubmit: () => void;
}) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const form = useForm<FormT>({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState<string | undefined>();
  const [loading, signUp] = useLoading(
    form.handleSubmit(async (data) => {
      await Auth.confirmSignUp(props.username, data.code).catch((e) =>
        setError(e.message),
      );
      await refreshUser();
      props.onSubmit();
      navigate('/');
    }),
  );
  return (
    <div className="grid gap-3">
      <Input
        type="text"
        placeholder="Code recieved by email"
        autoFocus
        {...form.register('code')}
        errorMessage={form.formState.errors.code?.message}
      />

      <Button onClick={signUp} loading={loading}>
        Complete sign up &amp; login
      </Button>
      {error && <div className="text-red-700">{error}</div>}
    </div>
  );
}
