import { Navbar } from '@/components/Navbar';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

function Game() {
  const { user, login_42, logout } = useAuth();

  const login = user?.login

  const { data, isLoading } = useApi().get('Get Me info', '/user');

  //   if (isLoading) return <div>Loading...</div>;
  //   console.log(data);

  return (
    <div>
      <Navbar />
      <div className="mt-10 flex w-screen justify-center gap-8">
        <h1>Profile page</h1>
        <button className="w-fit" onClick={() => login('apigeon@42.fr', '1234')}>
          Login
        </button>
        {user && (
          <button className="w-fit" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;
