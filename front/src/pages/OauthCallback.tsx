import { UseQueryResult } from 'react-query';
import { Navigate } from 'react-router-dom';

import UseSetToken from '@/components/Auth/UseSetToken';
import { tokenDto } from '@/dto/tokenDto';
import { useApi } from '@/hooks/useApi';

export default function OauthCallback() {
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');

  //TO DO : Handle errorType and errorMessage

  if (!code) {
    return <div>No code given</div>; // TO DO : Create pop up error, then redirect to '/'
  } else {
    return <UseCodeToGetToken code={code} />;
  }
}

const UseCodeToGetToken = (props: { code: string }) => {
  const query1 = useApi().get('send oauth code', '/auth/42/callback', {
    params: { code: props.code },
  }) as UseQueryResult<tokenDto>;

  console.log('[OauthCallback] query.data = ', query1.data);
  if (query1.isLoading) {
    return <div>Loading...</div>; // TO DO : Create loading button
  } else if (query1.isError) {
    return <div>Is error...</div>; // TO DO : Handle Error, and return to Home
  } else if (query1.data) {
    return <UseSetToken tokenDto={query1.data} />;
  } else {
    console.log('[OauthCallback] last else, return to /');
    return <Navigate to="/" />;
  }
};
