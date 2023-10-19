import React from 'react';
import { useNavigate } from 'react-router-dom';

import background from '@/assets/blurry-gradient-haikei.png';
import myImage from '@/assets/d9569bbed4393e2ceb1af7ba64fdf86a.jpg';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Table } from '@/components/Table';

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      <div className="absolute left-40 top-40 hidden gap-4 sm:flex">
        <img className="w-32 rounded-full" src={myImage} alt="profile pic" />
        <div className="flex flex-col items-start justify-end gap-4">
          <span className="text-dark-2">{'Je me presente "Le Boss"'}</span>
          <span className="left-0 font-bold">Lbesnard</span>
        </div>
      </div>
      <div className="absolute left-16 top-40 flex gap-4 sm:hidden">
        <img className="w-32 rounded-full" src={myImage} alt="profile pic" />
        <div className="flex flex-col items-start justify-end gap-4">
          <span className="text-dark-2">{'Je me presente "Le Boss"'}</span>
          <span className="left-0 font-bold">Lbesnard</span>
        </div>
      </div>
      <div className="flex w-screen items-center justify-center pt-32">
        <Table></Table>
      </div>
    </div>
  );
}

export default Profile;
