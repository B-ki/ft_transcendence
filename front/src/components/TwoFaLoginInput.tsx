import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { api, setApiToken } from '@/utils/api';

import { Button } from './Button';
import { tokenDto } from '@/dto/tokenDto';

const loginWithTwoFaCode = async ({ code, login }: { code: string; login: string | undefined }): Promise<tokenDto> => {
  const json = await api.post('auth/2fa/login', { json: { twoFACode: code, login: login } }).json();
  const token: tokenDto = json as tokenDto;
  return token;
};

export const TwoFaLoginInput = (props: any) => {
  const [code, setCode] = useState('');
  const { login, setToken } = useAuth();
  console.log('TwoFaLogin', login)

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
      alert('Wrong 2FA code')
    }
  });

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input type="test" name="2FAcode" onChange={handleCodeChange} />
      </form>
      <Button
        size="small"
        type="primary"
        onClick={() => mutation.mutateAsync({ code: code, login: login })}
      >
        Submit
      </Button>
    </>
  );
};
