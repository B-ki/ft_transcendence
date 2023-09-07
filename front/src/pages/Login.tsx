//import { RegisterForm } from '@/components/register/form';
import 'react-notifications-component/dist/theme.css';

import { ReactNotifications } from 'react-notifications-component';
import { Store } from 'react-notifications-component';

import logo_42 from '@/assets/42_Logo.svg';
import myImage from '@/assets/blurry-gradient-haikei.png';
import { Button } from '@/components/Button';

const handleClick = () => {
  console.log('hello');
  Store.addNotification({
    title: 'Wonderful!',
    message: 'You clicked the button',
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

export default function Login() {
  return (
    <div
      className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40"
      style={{ backgroundImage: `${myImage}`, backgroundSize: 'contain' }}
    >
      <ReactNotifications />
      <h1 className="text-6xl font-bold text-white-1">FT_TRANSENSENCE</h1>
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border-t-4 border-t-accent bg-white-1 p-10 shadow-md">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <Button onClick={handleClick} type="secondary" iconLeft={logo_42}>
          Login with 42
        </Button>
      </div>
    </div>
  );
}
