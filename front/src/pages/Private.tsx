import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import myImage from '@/assets/cool-profile-picture.jpg';
import React from 'react';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import { Store } from 'react-notifications-component';

function Private() {
  const { user, login, logout } = useAuth();
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
      <img className="w-32 rounded-full" src={myImage} />
      Very private page
    </div>
  );
}

export default Private;
