import { useNavigate } from 'react-router-dom';

import { useApi } from '@/hooks/useApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function OauthCallback() {
  const navigate = useNavigate();

  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  const errorType = queryParameters.get('error');
  const errorMessage = queryParameters.get('error_description');

  if (code) {
    const { data, isLoading, isError, error } = useApi().get(
      'send oauth code',
      '/auth/42/callback',
      {
        params: { code: code },
      },
    );

    if (isLoading) return <div>Loading...</div>; //put spiner
    if (isError) {
      console.log('error godamn');
      // {"message":"The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.","error":"Unauthorized","statusCode":401}
      //redirect to /login with error popup with error.message as content
      console.log('salut ' + JSON.stringify((error as any).response));
    }

    if (data) {
      console.log('data godamn');
      useLocalStorage().setItem('token', (data as any).token);
    }
  } else if (errorType) {
    // redirect to /login with error popup with errorMessage as content
  } else {
    console.log('test');
    navigate('/');
  }
  return <></>;
}
