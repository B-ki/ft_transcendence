import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

function Home() {
  const { user, login, logout } = useAuth();

  const { error, data, isLoading } = useApi().get('test', '/banks', {
    params: { test: 'bonjours' },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) console.log(error);
  if (data) console.log(data);

  return (
    <div>
      <div className="mt-10 flex w-screen justify-center gap-8">
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

export default Home;
