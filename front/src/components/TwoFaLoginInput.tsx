import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { tokenDto } from '@/dto/tokenDto';
import { useAuth } from '@/hooks/useAuth';
import { api, setApiToken } from '@/utils/api';

import { Button } from './Button';

const loginWithTwoFaCode = async ({
  code,
  login,
}: {
  code: string;
  login: string | undefined;
}): Promise<tokenDto> => {
  const json = await api.post('auth/2fa/login', { json: { twoFACode: code, login: login } }).json();
  const token: tokenDto = json as tokenDto;
  return token;
};
export const TwoFaLoginInput = (props: any) => {
  const [code, setCode] = useState('');
  const { login, setToken } = useAuth();

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = await loginWithTwoFaCode({ code, login });
      if (data.token) {
        setToken(data.token);
      }
      navigate('/');
    } catch (error) {
      alert('Wrong 2FA code');
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          className="rounded-md border border-dark-3 bg-white-3 p-1 invalid:border-red focus:border-blue focus:outline-none"
          type="text"
          name="2FAcode"
          placeholder="Enter your code"
          onChange={handleCodeChange}
        />
        <Button submit="submit" size="small" type="primary">
          Submit
        </Button>
      </form>
    </>
  );
};
