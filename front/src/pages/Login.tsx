import 'react-notifications-component/dist/theme.css';

import { ReactNotifications } from 'react-notifications-component';

// import { Store } from 'react-notifications-component';
// import { Navigate } from 'react-router-dom';
import logo_42 from '@/assets/42_Logo.svg';
// import background from '@/assets/wave-haikei.svg';
import { Button } from '@/components/Button';

export default function Login() {

  const redirect = () => {
    window.location.href = `${window.location.origin}/api/auth/42`;
    return null;
  };

  const handleLogin = () => {
    redirect();
  };

  return (
    <div className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40">
      <ReactNotifications />
      <h1 className="text-6xl font-bold text-primary">FT_TRANSCENDENCE</h1>
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border-t-4 border-t-accent bg-white-1 p-8 shadow-md">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <Button onClick={() => handleLogin()} type="secondary" iconLeft={logo_42}>
          Login with 42
        </Button>
        {/* {user && redirect()} */}
        <div className="flex w-full justify-center border-t-[1px] border-accent pt-2">
          <span className="text-grey">Our&nbsp;</span>{' '}
          <a
            className="text-grey underline underline-offset-1 hover:text-accent"
            href="https://github.com/B-ki/ft_transcendence"
          >
            Github
          </a>
        </div>
      </div>
    </div>
  );
}
