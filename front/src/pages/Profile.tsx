import { useCallback, useState } from 'react';
import { FormEvent, ChangeEvent } from 'react';
import { UseQueryResult, useMutation } from 'react-query';

import googleAuthenticatorLogo from '@/assets/GoogleAuthenticatorLogo.png';
import { Button } from '@/components/Button';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { api } from '@/utils/api';
import { queryClient } from '@/main';
import PicUploader from '@/components/PicUploader';
import { useDropzone } from 'react-dropzone';

function Profile() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [File, setFile] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  let user: userDto | undefined = undefined;

  const mutation1 = useMutation({
    mutationFn: (userInfos) => {
      return api.patch('user/me', { json: userInfos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get user profile'] });
      setUsername('');
      setDescription('');
      setShow(false);
    },
  });

  const updateImage = (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('user/me/image', { body: formData });
  };

  const mutation2 = useMutation({
    mutationFn: updateImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get user profile'] });
      setShow(false);
    },
  });

  const updateBanner = (file: File) => {
    const formData = new FormData();
    formData.append('banner', file);
    return api.post('user/me/banner', { body: formData });
  };

  const mutation3 = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get user profile'] });
      setShow(false);
    },
  });

  const { data, isLoading, isError } = useApi().get(
    'get user profile',
    'user/me',
  ) as UseQueryResult<userDto>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  user = data;

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const usernameInput = document.querySelector<HTMLInputElement>('#usernameInput');
    const descriptionInput = document.querySelector<HTMLInputElement>('#descriptionInput');
    const ProfilePic = document.querySelector<HTMLFormElement>('#ProfilePic');
    const Banner = document.querySelector<HTMLFormElement>('#Banner');

    if (ProfilePic) {
      mutation2.mutate(File);
    }
    if (Banner) {
      mutation3.mutate(banner);
    }

    if (usernameInput && descriptionInput) {
      if (usernameInput.value && descriptionInput.value) {
        mutation1.mutate({
          displayName: usernameInput.value,
          description: descriptionInput.value,
        });
      } else if (usernameInput.value) {
        mutation1.mutate({
          displayName: usernameInput.value,
        });
      } else if (descriptionInput.value) {
        mutation1.mutate({
          description: descriptionInput.value,
        });
      } else {
        console.log('nothing done');
      }
    }
  };

  const handleSetShow = () => {
    setShow(false);
    setUsername('');
    setDescription('');
  };

  return (
    <>
      <Modal onClose={handleSetShow} title="Edit your profile" show={show}>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-center"></div>
          <div className="flex flex-col items-center"></div>{' '}
        </div>
        <div className="pt-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-center gap-4">
                  <PicUploader
                    ID="ProfilePic"
                    name="Profile picture"
                    user={user}
                    setFile={setFile}
                  />
                  <PicUploader ID="Banner" name="Banner" user={user} setFile={setBanner} />
                </div>
                <label className="flex flex-col">
                  Username
                  <input
                    className="rounded-md border border-dark-3 bg-white-3 p-1  invalid:border-red focus:border-blue focus:outline-none"
                    key="0"
                    id="usernameInput"
                    placeholder="Enter your username..."
                    type="text"
                    maxLength={30}
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </label>
                <label className="flex flex-col">
                  Description
                  <input
                    className="rounded-md border border-dark-3 bg-white-3 p-1  invalid:border-red focus:border-blue focus:outline-none"
                    key="1"
                    id="descriptionInput"
                    placeholder="30 character maximum"
                    type="text"
                    maxLength={30}
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </label>
                <Button submit="submit" type="primary" size="small">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <Navbar />
      <div
        className="h-40 w-screen"
        style={{
          backgroundImage: `url(${user?.bannerPath})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></div>
      <div className="absolute left-40 top-40 hidden gap-4 sm:flex">
        <img
          className="h-32 w-32 rounded-full object-cover hover:cursor-pointer"
          src={user?.imagePath ? user?.imagePath : user?.intraImageURL}
          alt="Profile picture"
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
      <div className="absolute left-16 top-40 flex items-center justify-center gap-4 sm:hidden">
        <img
          className="h-32 w-32 rounded-full object-cover hover:cursor-pointer"
          src={user?.imagePath}
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
