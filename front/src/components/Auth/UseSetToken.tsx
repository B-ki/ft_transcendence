import { useEffect } from 'react';

import { tokenDto } from '@/dto/tokenDto';

import UseGetUser from './UseGetUser';

const UseSetToken = (props: { tokenDto: tokenDto }) => {
  useEffect(() => {
    console.log('[UseGetUser] useEffect => setItem(token)', props.tokenDto.token);
    // TO DO : Don't put a useQuery result in a useState, we optout all backgroung updates from
    // useQuery. https://tkdodo.eu/blog/practical-react-query
    localStorage.setItem('token', props.tokenDto.token);
  }, []);
  return <UseGetUser token={props.tokenDto.token} login={props.tokenDto.login} />;
};

export default UseSetToken;
