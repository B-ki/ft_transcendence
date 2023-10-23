import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

function Game() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="mt-10 flex w-screen justify-center gap-8">
        <h1>Game page</h1>
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
