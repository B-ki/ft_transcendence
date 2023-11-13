import React, { useState } from 'react';

import { Button } from './Button';
import { api } from '@/utils/api';
import { queryClient } from '@/main';
import { useMutation } from 'react-query';

export interface TwoFACodeProps {
  setShowInvalidate: (show: boolean) => void;
}

const postTwoFaActivation = async (code: string) => {
  const response = await api.post('auth/2fa/activate', { json: { twoFACode: code } });
  return response;
};

export const TwoFACode: React.FC<TwoFACodeProps> = ({ setShowInvalidate }) => {
  const [code, setCode] = useState('');

  const mutation = useMutation({
    mutationFn: postTwoFaActivation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get 2fa qrcode'] });
      setShowInvalidate(false);
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
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input type="test" name="2FAcode" onChange={handleCodeChange} />
      <Button size="small" type="primary" onClick={() => mutation.mutate(code)}>
        Submit
      </Button>
    </form>
  );
};
