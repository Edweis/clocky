import { Auth } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../lib/auth';
import useLoading from '../lib/use-loading';

export default function Account() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, signOut] = useLoading(async () => {
    await Auth.signOut();
    await refreshUser();
    navigate('/');
  });
  return (
    <Button loading={loading} onClick={signOut}>
      Log out
    </Button>
  );
}
