import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { queryClient } from '@/main';
import { api } from '@/utils/api';

import { Button } from './Button';

export const TwoFADeactivation = ({ setShowInvalidate }) => {
  const [code, setCode] = useState('');
  const mutation = useMutation({
    mutationFn: (code: string) => {
      console.log('[mutation TwoFACODE] code:', code);
      return api.post('auth/2fa/deactivate', { json: { twoFACode: code } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get 2fa qrcode'] });
      setShowInvalidate(false);
    },
  });

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    alert('Something was submitted: ' + code);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input type="test" name="2FAcode" onChange={handleCodeChange} />
      <Button size="small" type="secondary" onClick={() => mutation.mutate(code)}>
        Deactivate 2FA
      </Button>
    </form>
  );
};
