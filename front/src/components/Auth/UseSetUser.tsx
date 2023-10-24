import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { userDto } from '@/dto/userDto';
import { useAuth } from '@/hooks/useAuth';

const UseSetUser = (props: { user: userDto }) => {
  const { setUser } = useAuth();

  useEffect(() => {
    console.log('[UseSetUser] setUser to ', props.user);
    setUser(props.user);
  }, []); // TO DO : Check if [setUser] useful ?
  return <Navigate to="/home" />;
};
export default UseSetUser;
