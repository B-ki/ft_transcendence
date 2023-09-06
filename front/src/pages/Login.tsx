//import { RegisterForm } from '@/components/register/form';
import logo_42 from '@/assets/42_Logo.svg';
import { Button } from '@/components/Button';

export default function Login() {
  return (
    <div className="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40 bg-primary">
      <h1 className="text-6xl font-bold text-white-1">FT_TRANSENSENCE</h1>
      <div className="flex w-1/3 flex-col items-center justify-center gap-4 rounded-md border bg-white-1 p-10">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <Button type="secondary" iconLeft={logo_42}>
          Login with 42
        </Button>
      </div>
    </div>
  );
}
