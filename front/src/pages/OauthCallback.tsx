import { User } from '@/contexts/userInterface';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useEffect } from 'react';
import { UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';

export function getUser(login: string) : User {
  /*const { data } = useApi().get('getting profile', '/user/', {
    params: { id: login}
  });
  console.log(data);
  
 useEffect(() => {
  fetch(`/api/user?id=${login}`)
 }, []);*/
  fetch(`/api/user?id=${login}`);
  return { login: "rmorel", first_name: "a", last_name: "b", email: "c", imageURL: "d" };
}

export default function OauthCallback() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  const errorType = queryParameters.get('error');
  const errorMessage = queryParameters.get('error_description');
  const api = useApi();
  const { user, login_42 } = useAuth();

  if (code) {
    interface TokenData {
      token: string;
      login: string;
      // Add other properties as needed
    }
    const { data, isLoading, isError } = api.get('send oauth code', '/auth/42/callback', {
      params: { code: code! },
    }) as UseQueryResult<TokenData>;
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (isError) {
      console.log('Error occurred');
      navigate('/error'); // TODO : create an error page to navigate to
    }

    if (data) {
      console.log(data);
      console.log("on est la");
      localStorage.setItem('token', data.token);
      getUser('rmorel');
    }
  }


  const token = localStorage.getItem('token');

/*
  const { userProfile } = api.get('getting profile', '/user/', {
    params: { id: data.login }
  });
  console.log(userProfile);
*/

  return (
    <div className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40">
    <div>42 API callback page</div>
    <div>Received Code : {code}</div>
    <div>Received token : </div>
    <div>{token}</div>
    </div>
  );

}
