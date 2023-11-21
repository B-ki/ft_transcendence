import { useState } from 'react';
import { ChangeEvent, FormEvent } from 'react';
import { useMutation, UseQueryResult } from 'react-query';
import { Button } from '@/components/Button';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import PicUploader from '@/components/PicUploader';
import { gameDto } from '@/dto/gameDto';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { queryClient } from '@/main';
import { api } from '@/utils/api';

function Profile() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [File, setFile] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  let user: userDto | undefined = undefined;

  const mutation1 = useMutation({
    mutationFn: (userInfos: any) => {
      return api.patch('user/me', { json: userInfos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get user profile'] });
      queryClient.invalidateQueries({ queryKey: ['get games'] });
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

  const { data: win } = useApi().get('get user win', 'game/won') as UseQueryResult<gameDto[]>;
  const { data: lose } = useApi().get('get user lost', 'game/lost') as UseQueryResult<gameDto[]>;

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

    if (ProfilePic && File !== null) {
      mutation2.mutate(File);
    }
    if (Banner && banner !== null) {
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
      <div className="absolute left-40 top-40 hidden items-end gap-4 sm:flex">
        <div className="flex gap-4">
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
          <span className=" flex items-end justify-center text-white-3">
            W : {win?.length ? win?.length : 0} L : {lose?.length ? lose?.length : 0}
          </span>
        </div>
      </div>
      <div className="absolute left-16 top-40 flex justify-center gap-4 sm:hidden">
        <div className="flex gap-4">
          <img
            className="h-32 w-32 rounded-full object-cover hover:cursor-pointer"
            src={user?.imagePath ? user?.imagePath : user?.intraImageURL}
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
          <div className="flex items-end justify-center gap-1 text-white-3">
            <span className=" flex items-end justify-center">
              W : {win?.length ? win?.length : 0}
            </span>
            {'  '}
            <span> L : {lose?.length ? lose?.length : 0}</span>
          </div>
        </div>
      </div>
      <div className="flex w-screen items-center justify-center pt-32">
        <GameHistoryTable login={user?.login}></GameHistoryTable>
      </div>
    </>
  );
}

export default Profile;
