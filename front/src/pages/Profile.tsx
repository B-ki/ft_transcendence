import React, { useState } from 'react';

import banner from '@/assets/cool-profile-picture.jpg';
import myImage from '@/assets/d9569bbed4393e2ceb1af7ba64fdf86a.jpg';
import background from '@/assets/layeredWavesBg.svg';
import { Button } from '@/components/Button';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import PicUploader from '@/components/PicUploader';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { UseQueryResult } from 'react-query';
import { userDto } from '@/dto/userDto';

const inputs = [
  { id: '0', labelTxt: 'Username', inputTxt: 'Enter your username...', mandatory: true },
  { id: '1', labelTxt: 'Description', inputTxt: '30 character maximum', mandatory: false },
];

function Profile() {
  const [show, setShow] = useState(false);
  const { user } = useAuth();

  const createGame = () => {
    const query = useApi().post('game', '/game/create', {
      data: {
        winnerLogin: 'lbesnard',
        loserLogin: 'rcarles',
        winnerScore: 4,
        loserScore: 2,
      },
    }) as UseQueryResult<userDto[]>;
  };

  const handleSaveChanges = () => {
    console.log(user?.imageURL);
    //setUserName
    //setUserDesciption
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
      <Modal onClose={() => setShow(false)} title="Edit your profile" show={show}>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-center">
            <PicUploader picture={myImage} name="Profile picture" />
          </div>
          <div className="flex flex-col items-center">
            <PicUploader picture={banner} name="Banner" />
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          {inputs.map((item) => (
            <Input
              key={item.id}
              labelText={item.labelTxt}
              inputText={item.inputTxt}
              mandatory={item.mandatory}
            ></Input>
          ))}
          <Button onClick={handleSaveChanges} type="primary" size="small">
            Save Changes
          </Button>
        </div>
      </Modal>
      <Navbar />
      <div
        className="h-40 w-screen"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></div>
      <div className="absolute left-40 top-40 hidden gap-4 sm:flex">
        <img
          className="w-32 rounded-full hover:cursor-pointer"
          src={myImage}
          alt="profile pic"
          onClick={() => setShow(true)}
        />
        <div className="flex flex-col items-start justify-end gap-2">
          <span className="left-0 text-2xl font-bold text-white-1">{user?.login}</span>
          <span className="text-white-3">{'Je me presente "Le Boss"'}</span>
        </div>
      </div>
      <div className="absolute left-16 top-40 flex gap-4 sm:hidden">
        <img
          className="w-32 rounded-full"
          src={myImage}
          alt="profile pic"
          onClick={() => setShow(true)}
        />
        <div className="flex flex-col items-start justify-end gap-2">
          <span className="left-0 text-2xl font-bold text-white-1">{user?.login}</span>
          <span className="text-white-3">{'Je me presente "Le Boss"'}</span>
        </div>
      </div>
      <div className="flex w-screen items-center justify-center pt-32">
        <GameHistoryTable></GameHistoryTable>
        <Button type="primary" size="small" onClick={createGame}>
          Create game
        </Button>
      </div>
    </div>
  );
}

export default Profile;
