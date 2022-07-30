import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Auth } from '@aws-amplify/auth';
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
  const [loading, signIn] = useLoading(
    form.handleSubmit((data: FromT) => Auth.signIn(data)),
  );
  return (
    <div className="h-[40vh] flex flex-col justify-center">
      <div className="grid gap-3 justify-center">
        <Input
          label="Email"
          type="email"
          autoFocus
          inputMode="email"
          {...form.register('username')}
        />
        <Input
          label="Password"
          type="password"
          {...form.register('password')}
        />
        <div className="flex justify-center mt-3">
          <Button onClick={signIn} loading={loading}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
