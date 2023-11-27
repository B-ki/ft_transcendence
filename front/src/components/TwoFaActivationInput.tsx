import React, { useState } from 'react';
import { useMutation } from 'react-query';

import { queryClient } from '@/main';
import { api } from '@/utils/api';

import { Button } from './Button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export interface TwoFACodeProps {
  setShowInvalidate: (show: boolean) => void;
}

const postTwoFaActivation = async (code: string) => {
  const response = await api.post('auth/2fa/activate', { json: { twoFACode: code } });
  return response;
};

export const TwoFACode: React.FC<TwoFACodeProps> = ({ setShowInvalidate }) => {
  const [code, setCode] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: postTwoFaActivation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get 2fa qrcode'] });
      setShowInvalidate(false);
      logout();
      navigate('/login');
    },
    onError: () => {
      alert('Wrong 2FA code');
    },
  });

  const handleCodeChange = (e: any) => {
    setCode(e.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <input
        className="rounded-md border border-dark-3 bg-white-3 p-1 invalid:border-red focus:border-blue focus:outline-none"
        name="2FAcode"
        onChange={handleCodeChange}
      />
      <Button size="small" type="primary" onClick={() => mutation.mutate(code)}>
        Submit
      </Button>
    </form>
  );
};
