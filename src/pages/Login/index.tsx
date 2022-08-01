import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Login() {
  return (
    <div className="flex gap-5 flex-col justify-center mt-10">
      <div>
        <h2 className="text-xl text-center mb-2">Sign Up</h2>
        <SignUp />
      </div>
      <div>
        <h2 className="text-xl text-center mb-2">Sign In</h2>
        <SignIn />
      </div>
    </div>
  );
}
