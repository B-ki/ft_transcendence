import { UseQueryResult } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';

import UseSetToken from '@/components/Auth/UseSetToken';
import { tokenDto } from '@/dto/tokenDto';
import { useApi } from '@/hooks/useApi';

export default function OauthCallback() {
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  //const errorType = queryParameters.get('error');
  //const errorMessage = queryParameters.get('error_description');
  const api = useApi();

  //TO DO : Handle errorType and errorMessage

  const query1 = api.get('send oauth code', '/auth/42/callback', {
    params: { code: code },
    enabled: !!code,
  }) as UseQueryResult<tokenDto>;
  console.log('[OauthCallback] query.data = ', query1.data);
  if (query1.isLoading) {
    return <div>Loading...</div>;
  } else if (query1.isError) {
    return <div>Is error...</div>;
  } else if (query1.data) {
    return <UseSetToken tokenDto={query1.data} />;
  } else {
    console.log('[OauthCallback] last else, return to /');
    return <Navigate to="/" />;
  }
}

/*

TO DO :

B- Verify errors : If not accepted to give permission to 42 API for example, etc.

C- Configure linter, to check hook rules, etc.

*/
