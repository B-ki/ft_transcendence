import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

function Friends() {
  const { user, logout } = useAuth();

  // TO DO : When reloading Friends page, user is null. How can we fix that ?

  console.log('[Friends] user = ', user);

  //const { data, isLoading } = useApi().get('Get Me info', '/user');

  //   if (isLoading) return <div>Loading...</div>;
  //   console.log(data);

  return (
    <div>
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
