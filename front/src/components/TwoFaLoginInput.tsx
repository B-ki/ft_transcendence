import { useState } from 'react';

import { Button } from './Button';
import {Navigate, useNavigate} from 'react-router-dom';
import {api} from '@/utils/api';
import {useMutation} from 'react-query';
import {useAuth} from '@/hooks/useAuth';

export const TwoFaLoginInput = (props: any) => {
	const login = props.login;
  const [code, setCode] = useState('');
  const { setToken } = useAuth();

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  const handleSubmit = () => {
  };

  const navigate = useNavigate();

  const mutation = useMutation({
	mutationFn: async (code: string, login: string) => {
      const response = await api.post('auth/2fa/login', { json: { twoFACode: code, login: login } });
      return response;
    },
    onSuccess: () => {
	    navigate("/");
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input type="test" name="2FAcode" onChange={handleCodeChange} />
      <Button size="small" type="primary" onClick={() => mutation.mutate(code, login)}>
        Submit
      </Button>
    </form>
  );
};
