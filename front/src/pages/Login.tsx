import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css';

import { ReactNotifications } from 'react-notifications-component';
import { Store } from 'react-notifications-component';

import logo_42 from '@/assets/42_Logo.svg';
import myImage from '@/assets/blurry-gradient-haikei.png';
import { Button } from '@/components/Button';

export default function Login() {
  const { user, login, logout } = useAuth();

  const { error, data, isLoading } = useApi().get('test', '/banks', {
    params: { test: 'bonjours' },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) console.log(error);
  if (data) console.log(data);

  const handleLogin = (login: (email: string, password: string) => void) => {
    login('apigeon@42.fr', '1234');
    Store.addNotification({
      title: 'Wonderful!',
      message: 'You are connected',
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true,
      },
    });
  };

  return (
    <div
      className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40"
      style={{ backgroundImage: `${myImage}`, backgroundSize: 'contain' }}
    >
      <ReactNotifications />
      <h1 className="text-6xl font-bold text-primary">FT_TRANSENSENCE</h1>
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border-t-4 border-t-accent bg-white-1 p-8 shadow-md">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <Button onClick={() => handleLogin(login)} type="secondary" iconLeft={logo_42}>
          Login with 42
        </Button>
        {user && <Navigate to="/private" />}
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
