import { UseQueryResult } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';

// import UseSetToken from '@/components/Auth/UseSetToken';
import { tokenDto } from '@/dto/tokenDto';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import {TwoFaLogin} from './TwoFaLogin';

export default function OauthCallback() {
	const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  const { setToken } = useAuth();

  if (!code) {
    return <div>No code given</div>; // TO DO : Create pop up error, then redirect to '/'
  }

  const { data, isLoading, isError } = useApi().get('send oauth code', '/auth/42/callback', {
    params: { code },
	options: {enabled : !!code, }
  }) as UseQueryResult<tokenDto>;

  if (isLoading) {
    return <div>Loading...</div>; // TO DO : Create loading button
  } else if (isError) {
    console.log(isError);
    return <div>Is error...</div>;
  } else if (data.require2FA) {
    return <Navigate to="/2falogin" />;
  } else {
    setToken(data!.token);
    return <Navigate to="/" />;
  }
}
