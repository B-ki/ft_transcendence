import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { tokenDto } from '@/dto/tokenDto';
import { useAuth } from '@/hooks/useAuth';
import { api, setApiToken } from '@/utils/api';

import { Button } from './Button';

const loginWithTwoFaCode = async ({ code }: { code: string }): Promise<tokenDto> => {
  const json = await api.post('auth/2fa/login', { json: { twoFACode: code } }).json();
  const token: tokenDto = json as tokenDto;
  return token;
};

export const TwoFaLoginInput = (props: any) => {
  const [code, setCode] = useState('');
  const { login, setToken } = useAuth();

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  const handleSubmit = () => {};

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginWithTwoFaCode,
    onSuccess: (data) => {
      if (data.token) {
        setToken(data.token);
      }
      navigate('/');
    },
    onError: () => {
      alert('Wrong 2FA code');
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          className="rounded-md border border-dark-3 bg-white-3 p-1 invalid:border-red focus:border-blue focus:outline-none"
          type="test"
          name="2FAcode"
          onChange={handleCodeChange}
        />
      </form>
      <Button size="small" type="primary" onClick={() => mutation.mutateAsync({ code: code })}>
        Submit
      </Button>
    </>
  );
};
