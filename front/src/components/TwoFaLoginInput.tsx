import { useState } from 'react';

import { useApi } from '@/hooks/useApi';

import { Button } from './Button';
import {Navigate, useNavigate} from 'react-router-dom';
import {api} from '@/utils/api';
import {useMutation} from 'react-query';
import {useAuth} from '@/hooks/useAuth';

export const TwoFaLoginInput = (props) => {
	console.log('[TwoFaLoginInput] props:', props);
	const login = props.login;
	console.log('[TwoFaLoginInput] login:', login);
  const [code, setCode] = useState('');
  const { setToken } = useAuth();

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    alert('Something was submitted: ' + code);
  };

  const navigate = useNavigate();
  const mutation = useMutation({
	mutationFn: (code: string, login: string) => {
	  login = 'rmorel';
	  console.log('[TwoFaLoginInput] code, login:', code, login);
      return api.post('auth/42/2fa', { json: { twoFACode: code, login: login } });
    },
    onSuccess: () => {
	console.log("mutation result =", mutation.data);
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
