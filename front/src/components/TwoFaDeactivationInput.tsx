import React, { useState } from 'react';
import { useMutation } from 'react-query';

import { queryClient } from '@/main';
import { api } from '@/utils/api';

import { Button } from './Button';

export interface TwoFACodeProps {
  setShowInvalidate: (show: boolean) => void;
}

const postTwoFaDeactivation = async (code: string) => {
  const response = await api.post('auth/2fa/deactivate', { json: { twoFACode: code } });
  return response;
};

export const TwoFADeactivation: React.FC<TwoFACodeProps> = ({ setShowInvalidate }) => {
  const [code, setCode] = useState('');

  const mutation = useMutation({
    mutationFn: postTwoFaDeactivation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get 2fa qrcode'] });
      setShowInvalidate(false);
    },
    onError: () => {
      alert('Wrong 2FA code');
    },
  });

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    mutation.mutate(code);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <input
        type="test"
        name="2FAcode"
        onChange={handleCodeChange}
        className="rounded-md border border-dark-3 bg-white-3 p-1  invalid:border-red focus:border-blue focus:outline-none"
      />
      <Button size="small" type="secondary" submit="submit">
        Deactivate 2FA
      </Button>
    </form>
  );
};
