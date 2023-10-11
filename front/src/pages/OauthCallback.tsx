import { useNavigate } from 'react-router-dom';

import { useApi } from '@/hooks/useApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export default function OauthCallback() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = { string: queryParameters.get('code') };
  const errorType = queryParameters.get('error');
  const { error, data, isLoading } = useApi().post('JWTtoken', '/auth/42/callback');

  const loadOnce = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      console.log(error);
      return <div>Error occurred while fetching data.</div>;
    }
    console.log(data);
  };

  // useEffect(() => {
  //   loadOnce();
  // }, []);

  return <>bonjour</>;
}
