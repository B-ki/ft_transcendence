import { Navbar } from '@/components/Navbar';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import ApiClient from '@/utils/apiAxios';
import background from '@/assets/layeredWavesBg.svg';

function Friends() {
  const { user, logout } = useAuth();

  // TO DO : When reloading Friends page, user is null. How can we fix that ?

  //console.log('[Friends] user = ', user);
  console.log('[Friends] user login = ', user?.login);

  //const { data, isLoading } = useApi().get('Get Me info', '/user');

  //   if (isLoading) return <div>Loading...</div>;
  //   console.log(data);

  return (
    <div
      className="relative flex h-screen w-screen flex-col"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Navbar />
      <div className="mt-10 flex w-screen justify-center gap-8">
        <h1>Friends page</h1>
        {user && (
          <button className="w-fit" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Friends;
