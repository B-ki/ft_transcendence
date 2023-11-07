import { UseQueryResult } from 'react-query';

import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

function Friends() {
  const { logout } = useAuth();

  let user: userDto | undefined = undefined;

  const { data, isLoading, isError } = useApi().get(
    'Get user infos',
    '/user/friends/friendlist',
  ) as UseQueryResult<userDto>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  if (data) {
    user = data;
  }

  return (
<<<<<<< HEAD
    <div className="mt-10 flex w-screen justify-center gap-8">
      <h1>Friends page</h1>
      {user && (
        <button className="w-fit" onClick={logout}>
          Logout
        </button>
      )}
=======
    <div
      className="relative flex h-screen w-screen flex-col"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Navbar />
      <div className="mt-10 flex w-screen justify-center gap-8"></div>
>>>>>>> 720c75f (using user infos in profilePage)
    </div>
  );
}

export default Friends;
