import { UseQueryResult } from 'react-query';
import { Navigate } from 'react-router-dom';

import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

import UseSetUser from './UseSetUser';

const UseGetUser = (props: { token: string; login: string }) => {
  const query = useApi().get('my user', `/user/id/${props.login}`) as UseQueryResult<userDto>;
  console.log(`[UseGetUser] query user/id/${props.login}`, query.data);
  if (query.isError) {
    return <div>Cant reach user</div>; // TO DO : handdle error
  } else if (query.isLoading) {
    return <div>Still loading...</div>;
  } else if (query.data) {
    return <UseSetUser user={query.data} />;
  } else {
    console.log('[UseGetUser] last else', query);
    return <Navigate to="/" />;
  }
};

export default UseGetUser;
