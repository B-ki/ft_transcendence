import React from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { useNavigate } from 'react-router-dom';

import background from '@/assets/blurry-gradient-haikei.png';
import myImage from '@/assets/cool-profile-picture.jpg';
import { Button } from '@/components/Button';
// import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

function Private() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // const { error, data, isLoading } = useApi().get('test', '/banks', {
  //   params: { test: 'bonjours' },
  // });

  // if (isLoading) return <div>Loading...</div>;
  // if (error) console.log(error);
  // if (data) console.log(data);

  const handleClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className="relative flex h-screen w-screen flex-col"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute right-2 top-2">
        <Button size="large" type="primary" onClick={() => handleClick()}>
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
