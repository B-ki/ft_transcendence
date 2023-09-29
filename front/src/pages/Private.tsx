import React from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { useNavigate } from 'react-router-dom';

import background from '@/assets/blurry-gradient-haikei.png';
import myImage from '@/assets/cool-profile-picture.jpg';
import { Button } from '@/components/Button';
import { Navbar } from '@/components/Navbar';
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
    <div className="relative flex h-screen w-screen flex-col">
      <Navbar />
      <div
        className="h-40 w-screen"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></div>
      <div className=""></div>
      <ReactNotifications />
      <div className="">
        <img className="w-32 rounded-full" src={myImage} alt="profile pic" />
        <div className="flex flex-col items-start justify-end gap-4">
          <span className="text-dark-2">{'Je me presente "Le Boss"'}</span>
          <span className="left-0 font-bold">Lbesnard</span>
        </div>
      </div>
    </div>
  );
}

export default Private;
