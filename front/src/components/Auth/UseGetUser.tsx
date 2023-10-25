import { useQuery, UseQueryResult } from 'react-query';
import { Navigate } from 'react-router-dom';

import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import ApiClient, { getUser } from '@/utils/apiAxios';

import UseSetUser from './UseSetUser';

const fetchUserData = async (login: string, token: string | null) => {
  const response = await fetch(`/api/user/${login}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

const UseGetUser = (props: { token: string; login: string }) => {
  // This doesn't work because enabled parameter isn't correctly use with useApi()
  //const query = useApi().get('my user', `/user/${props.login}`, { enabled: !!props.token }) as UseQueryResult<userDto>;

  const query = useQuery(['userData', props.login], () => fetchUserData(props.login, props.token), {
    enabled: !!props.token,
  });

  if (query.isError) {
    return <div>Cant reach user</div>; // TO DO : handdle error
  } else if (query.isLoading) {
    return <div>Loading...</div>; // Change to a loading component
  } else if (query.data) {
    return <UseSetUser user={query.data} />;
  } else {
    console.log('[UseGetUser] last else', query);
    return <Navigate to="/" />;
  }
};

export default UseGetUser;
