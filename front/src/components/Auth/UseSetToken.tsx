import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { tokenDto } from '@/dto/tokenDto';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import UseGetUser from './UseGetUser';

const UseSetToken = (props: { tokenDto: tokenDto }) => {
  const { setItem } = useLocalStorage();

  useEffect(() => {
    console.log('[UseGetUser] useEffect => setItem(token)', props.tokenDto.token);
    setItem('token', props.tokenDto.token);
  }, []);
  return <UseGetUser token={props.tokenDto.token} login={props.tokenDto.login} />;
};

export default UseSetToken;