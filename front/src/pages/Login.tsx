import 'react-notifications-component/dist/theme.css';

import logo_42 from '@/assets/42_Logo.svg';
import background from '@/assets/layeredWavesBg.svg';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { login_42 } = useAuth();

  return (
    <div
      className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div>
        <h1 className="flex items-center justify-center text-6xl font-bold text-white-1">
          Our Pong
        </h1>
        <h2 className="flex items-center justify-center text-6xl font-bold text-white-1">Game</h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border-t-4 border-t-accent bg-white-1 p-8 shadow-md">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <Button size="small" onClick={login_42} type="secondary" iconLeft={logo_42}>
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
