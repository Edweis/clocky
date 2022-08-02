import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Login() {
  return (
    <div className="flex gap-5 flex-col justify-center mt-10">
      <div>
        <h2 className="text-xl text-center mb-2">
          Want to save your progress?
        </h2>
        <SignUp />
      </div>
      <div>
        <h2 className="text-xl text-center mb-2">Already have an account?</h2>
        <SignIn />
      </div>
    </div>
  );
}
