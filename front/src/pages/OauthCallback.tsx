import { UseQueryResult } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';

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

  const { data, isLoading, isError, status, error } = useApi().get(
    'send oauth code',
    '/auth/42/login',
    { params: { code }, options: { enabled: !!code } },
  ) as UseQueryResult<tokenDto>;

  if (isLoading) {
    return <div>Loading...</div>; // TO DO : Create loading button
  } else if (isError) {
    return <div>Is error...</div>;
  } else if (data && data.require2FA) {
    setToken(data.token);
    return <Navigate to="/2falogin" />;
  } else if (data && data.token) {
    setToken(data.token);
    return <Navigate to="/" />;
  } else {
    //alert('42 login failed, please check your secret or the redirection URL of your 42 API');
    return <Navigate to="/" />;
  }
}
