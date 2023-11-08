import { UseQueryResult } from 'react-query';
import { Navigate } from 'react-router-dom';

// import UseSetToken from '@/components/Auth/UseSetToken';
import { tokenDto } from '@/dto/tokenDto';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

export default function OauthCallback() {
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  const { setToken } = useAuth();

  if (!code) {
    return <div>No code given</div>; // TO DO : Create pop up error, then redirect to '/'
  }

  const { data, isLoading, isError, error } = useApi().get('send oauth code', '/auth/42/callback', {
    params: { code },
  }) as UseQueryResult<tokenDto>;
  console.log(error);
  if (isLoading) {
    return <div>Loading...</div>; // TO DO : Create loading button
  } else if (isError) {
    console.log(isError);
    return <div>Is error...</div>;
  } else if (data!.require2FA) {
    console.log('Need to move to 2FA page');
    return <Navigate to="/2falogin" ftApiCode={{ ftApiCode: code }} />;
  } else {
    setToken(data!.token);
    return <Navigate to="/" />;
  }
}
