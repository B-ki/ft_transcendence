import React, { useEffect, useState } from 'react';
import { UseQueryResult, useMutation } from 'react-query';

import banner from '@/assets/cool-profile-picture.jpg';
import myImage from '@/assets/d9569bbed4393e2ceb1af7ba64fdf86a.jpg';
import { Button } from '@/components/Button';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import PicUploader from '@/components/PicUploader';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { api } from '@/utils/api';

const inputs = [
  {
    id: 'usernameInput',
    labelTxt: 'Username',
    inputTxt: 'Enter your username...',
    mandatory: true,
  },
  {
    id: 'descriptionInput',
    labelTxt: 'Description',
    inputTxt: '30 character maximum',
    mandatory: false,
  },
];

function Profile() {
  const [show, setShow] = useState(false);
  let user: userDto | undefined = undefined;
  let image: string | undefined;

  const mutation = useMutation({
    mutationFn: (userInfos) => {
      return api.patch('user/me', { json: userInfos });
    },
  });

  const { data, isLoading, isError } = useApi().get(
    'get user profile',
    '/user/me',
  ) as UseQueryResult<userDto>;

  // const displayNameQuery = useApi().patch('my games', `/user/me/displayName`, {
  //   data: { displayName: '', description: '' },
  //   options: { manual: true },
  // }) as UseQueryResult<userDto>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  user = data;

  const handleSaveChanges = (event: React.SyntheticEvent) => {
    event.preventDefault;
    mutation.mutate();
    //displayNameQuery.refetch({});
    //setUserName
    //setUserDesciption
  };

  return (
    <>
      <Modal onClose={() => setShow(false)} title="Edit your profile" show={show}>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-center"></div>
          <div className="flex flex-col items-center"></div>{' '}
        </div>
        <div className="pt-2">
          <form onSubmit={handleSaveChanges} className="flex flex-col items-center gap-2">
            {inputs.map((item) => (
              <Input
                key={item.id}
                labelText={item.labelTxt}
                inputText={item.inputTxt}
                mandatory={item.mandatory}
              ></Input>
            ))}
            <Button size="small" type="primary">
              Save Changes
            </Button>
          </form>
        </div>
      </Modal>
      <Navbar />
      <div
        className="h-40 w-screen"
        style={{
          backgroundImage: `url(${user?.bannerUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></div>
      <div className="absolute left-40 top-40 hidden gap-4 sm:flex">
        <img
          className="w-32 rounded-full hover:cursor-pointer"
          src={user?.imageUrl}
          alt="profile pic"
          onClick={() => setShow(true)}
        />
        <div className="flex flex-col items-start justify-end gap-2">
          <span className="left-0 text-2xl font-bold text-white-1">
            {user?.displayName ? user?.displayName : user?.login}
          </span>
          <span className="text-white-3">
            {user?.description ? user?.description : 'Edit your description'}
          </span>
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
          <span className="left-0 text-2xl font-bold text-white-1">
            {user?.displayName ? user?.displayName : user?.login}
          </span>
          <span className="text-white-3">
            {user?.description ? user?.description : 'Edit your description'}
          </span>
        </div>
      </div>
      <div className="flex w-screen items-center justify-center pt-32">
        <GameHistoryTable></GameHistoryTable>
      </div>
    </>
  );
}

export default Profile;
