import { useApi } from '@/hooks/useApi';
import axios from 'axios';
import { useEffect } from 'react';
import { UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';

export default function OauthCallback() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get('code');
  const errorType = queryParameters.get('error');
  const errorMessage = queryParameters.get('error_description');
  const api = useApi();

    if (code) {
      interface TokenData {
        token: string;
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
        localStorage.setItem('token', data.token);
      }
    }
    const token = localStorage.getItem('token');

  return (
    <div className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40">
    <div>42 API callback page</div>
    <div>Received Code : {code}</div>
    <div>Received token : </div>
    <div>{token}</div>
    </div>
  );

}
