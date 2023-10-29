import { Navbar } from '@/components/Navbar';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

function Home() {
  const { user, login_42, logout } = useAuth();

  // Not working anymore
  // const { data, isLoading } = useApi().get('Get Me info', '/user');

  // if (isLoading) return <div>Loading...</div>;
  // console.log(data);

  return (
    <div>
      <Navbar />
      <div className="mt-10 flex w-screen justify-center gap-8">
        <h1>Home Page</h1>
        <button className="w-fit" onClick={() => login_42()}>
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
