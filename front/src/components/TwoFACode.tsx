import { useState } from 'react';

import { useApi } from '@/hooks/useApi';

import { Button } from './Button';

export const TwoFACode = () => {
  const [code, setCode] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    alert('Something was submitted: ' + code);
  };

  const { data, isLoading, isError, refetch } = useApi().post(
    'post 2fa code',
    '/auth/2fa/authenticate',
    {
      data: { twoFACode: code },
      options: { enabled: false },
    },
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input type="test" name="2FAcode" onChange={handleCodeChange} />
      <Button size="small" type="primary" onClick={refetch}>
        Submit
      </Button>
    </form>
  );
};
