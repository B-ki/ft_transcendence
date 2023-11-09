import { UseQueryResult } from 'react-query';

import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import Form from '@/components/Form';

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
    <div className="mt-10 flex w-screen justify-center gap-8">
      <Form></Form>
    </div>
  );
}

export default Friends;
