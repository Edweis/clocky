import { useState } from 'react';
import Challenge from './Challenge';
import Register from './Register';

type State = { state: 'register' } | { state: 'challenge'; username: string };
export default function SignUp() {
  const [state, setState] = useState<State>({ state: 'register' });
  if (state.state === 'register')
    return (
      <Register
        onSubmit={(username) => setState({ state: 'challenge', username })}
      />
    );
  if (state.state === 'challenge')
    return (
      <Challenge
        username={state.username}
        onSubmit={() => setState({ state: 'register' })}
      />
    );
}
