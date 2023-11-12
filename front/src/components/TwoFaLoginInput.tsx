import { useEffect, useState } from 'react';

import { Button } from './Button';
import { useNavigate} from 'react-router-dom';
import {api, setApiToken} from '@/utils/api';
import { useMutation} from 'react-query';
import {useAuth} from '@/hooks/useAuth';

const loginWithTwoFaCode = async ({code, login} : {code: string, login: string | undefined}) => {
      const json = await api.post('auth/2fa/login', { json: { twoFACode: code, login: login } }).json();
      return json;
}

export const TwoFaLoginInput = (props: any) => {
  const [code, setCode] = useState('');
  const { login, setToken } = useAuth();

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  const handleSubmit = () => {
  };

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginWithTwoFaCode,     
    onSuccess: data => {
      if (data.token) {
        setToken(data.token)
      }
	    navigate("/");
    },
  })

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input type="test" name="2FAcode" onChange={handleCodeChange} />
    </form>
      <Button size="small" type="primary" onClick={() => mutation.mutateAsync({code: code, login: login})}>
        Submit
      </Button>
    </>
  );
};
