import { AuthContext } from '@/contexts/AuthContext';
import { tokenDto } from '@/dto/tokenDto';
import { dummyUserDto, userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import useApiTest from '@/hooks/useApiTest';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ApiClient from '@/utils/apiAxios';
import { useContext, useEffect } from 'react';
import { UseQueryResult, useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { json } from 'stream/consumers';

export async function getUser(login: string): Promise<userDto | void> {
  try {
    const userData = await ApiClient.getInstance()
      .get<userDto>(`/user/id/${login}`)
      .then((userData) => {
        console.log('User data:', userData);
      });
    return userData;
  } catch (error) {
    // TO-DO : handle error
  }
}

export default function OauthCallback() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  const errorType = queryParameters.get('error');
  const errorMessage = queryParameters.get('error_description');
  const api = useApi();
  const { setUser } = useAuth();
  const { setItem } = useLocalStorage();

  const query1 = api.get('send oauth code', '/auth/42/callback', {
    params: { code: code },
    enabled: !!code,
  }) as UseQueryResult<tokenDto>;

  if (query1.isLoading) {
    // Can't return here
  }

  if (query1.isError) {
    console.log('Error occurred');
    //navigate('/error'); // Can't navigate here
  }

  if (query1.data) {
    console.log(query1.data);
    localStorage.setItem('token', query1.data.token);
    //setItem('token', query1.data.token);
    console.log('login is :', query1.data.login);
  }

  useEffect(() => {
    if (query1.data?.token) setItem('token', query1.data.token);
  }, [query1.data?.token, setItem]);

  const query2 = api.get('my user', `/user/id/rmorel`, {
    enabled: !!query1.data,
  }) as UseQueryResult<userDto>;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setUser(dummyUserDto);
      console.log('setting user !');
    }
  }, [token, setUser]);

  return (
    <div className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40">
      <div>42 API callback page</div>
      <div>Received Code : {code}</div>
      <div>Received token : </div>
      <div>{token}</div>

    </div>
  );
}

const useUpdateUser = (token: tokenDto) => {
  const { setUser } = useAuth();
  const query = useApi().get('my user', `/user/id/${token.login}`) as UseQueryResult<userDto>;
  console.log('query', query.data);
  console.log('dummyDto', dummyUserDto);
  useEffect(() => {
    console.log('setting user !');
    setUser(dummyUserDto);
  }, [setUser]);
  return (<>{query}</>);
}

/*

TO DO :

A- Modify OauthCallback
query1 only if code : Done
now 3 cases :
isLoading : return component for Loading
isError : return component for Error
data : return component for managing data, called useUpdateUser

useUpdateUser :

- useEffect -> setItem with useLocalStorage, or remove item if no token ? Sure this will not cause trouble ?
- query2 -> only if token exist
- useEffect -> set user in AuthContext

B- Verify errors : If not accepted to give permission to 42 API for example, etc.

C- Configure linter, to check hook rules, etc.

*/