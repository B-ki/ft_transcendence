import React from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { useNavigate } from 'react-router-dom';

import myImage from '@/assets/cool-profile-picture.jpg';
import { Button } from '@/components/Button';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

function Private() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { error, data, isLoading } = useApi().get('test', '/banks', {
    params: { test: 'bonjours' },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) console.log(error);
  if (data) console.log(data);

  const handleClick = () => {
    logout();
    navigate('/app');
  };

  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div className="absolute right-2 top-2">
        <Button type="primary" onClick={() => handleClick()}>
          logout
        </Button>
      </div>
      <ReactNotifications />
      <img className="w-32 rounded-full" src={myImage} alt="profile pic" />
      Very private page
    </div>
  );
}

export default Private;
