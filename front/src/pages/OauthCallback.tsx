import { useApi } from '@/hooks/useApi';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OauthCallback() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  const errorType = queryParameters.get('error');
  const errorMessage = queryParameters.get('error_description');

  const { error: getTokenError, data: tokenData, isLoading: tokenLoading } = useApi().get('getAuthorizationCode', '/auth/42');
  if (code) {
    const { data, isLoading, error } = useApi().get('send oauth code', '/auth/42/callback', {
      params: { code: code },
    });
         useEffect(() => {
      axios.get('/api/auth/42/callback?code' + code).then((data) => {
        console.log(data);
        localStorage.setItem('token', data.data);
      });
    }, []);
      useEffect(() => {
        fetch('/api/auth/42/callback?code=' + code)
          .then((response) => {
            response.json().then((json) => {
              console.log(json.token);
              localStorage.setItem('token', json.token);
              navigate('/');
            });
          })
          .catch((error) => {
            console.log('errorrred');
            console.log(error);
            navigate('/login');
          });
      }, []);
    }

  return <div>Bonjour</div>;
  
}
