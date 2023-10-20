import { Navbar } from '@/components/Navbar';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import ApiClient from '@/utils/apiAxios';

function Friends() {
  const { user, logout } = useAuth();

  //const { data, isLoading } = useApi().get('Get Me info', '/user');

  //   if (isLoading) return <div>Loading...</div>;
  //   console.log(data);

  ApiClient.getInstance().get('/user/all');

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
