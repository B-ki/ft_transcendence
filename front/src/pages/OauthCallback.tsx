import { AuthContext } from '@/contexts/AuthContext';
import { User } from '@/dto/userInterface';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import ApiClient from '@/utils/apiAxios';
import { useContext } from 'react';
import { UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';

export async function getUser(login: string, jwtToken: string): Promise<User | void> {
  try {
    const userData = await ApiClient.getInstance()
      .get<User>(`/user/id/${login}`)
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
  const { settingUser } = useAuth();

  if (code) {
    interface TokenData {
      token: string;
      login: string;
      // Add other properties as needed
    }
    const { data, isLoading, isError } = api.get('send oauth code', '/auth/42/callback', {
      params: { code: code },
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
      console.log('on est la');
      localStorage.setItem('token', data.token);
      const userData = getUser('rmorel', data.token);
      if (userData) {
        settingUser(userData);
      }
    }
  }

  // Fix problem on redirection
  navigate('/friends');

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
