import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useParams } from 'react-router-dom';

import { GameHistoryTable } from '@/components/GameHistoryTable';
import { gameDto } from '@/dto/gameDto';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

function User() {
  const routeParams = useParams();
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [File, setFile] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const { data: games } = useApi().get(
    'get user win',
    `game/all/${routeParams.login}`,
  ) as UseQueryResult<gameDto[]>;

  const {
    data: user,
    isLoading,
    isError,
  } = useApi().get(
    'get user profile',
    `user/profile/${routeParams.login}`,
  ) as UseQueryResult<userDto>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  const win = games?.filter((g) => g.winner.login === routeParams.login).length;
  const lose = games?.filter((g) => g.loser.login === routeParams.login).length;

  return (
    <>
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
            className="h-32 w-32 rounded-full object-cover"
            src={user?.imagePath ? user?.imagePath : user?.intraImageURL}
            alt="Profile picture"
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
            W : {win ? win : 0} L : {lose ? lose : 0}
          </span>
        </div>
      </div>
      <div className="absolute left-16 top-40 flex justify-center gap-4 sm:hidden">
        <div className="flex gap-4">
          <img
            className="h-32 w-32 rounded-full object-cover "
            src={user?.imagePath ? user?.imagePath : user?.intraImageURL}
            alt="profile pic"
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
            <span className=" flex items-end justify-center">W : {win ? win : 0}</span>
            {'  '}
            <span> L : {lose ? lose : 0}</span>
          </div>
        </div>
      </div>
      <div className="flex w-screen items-center justify-center pt-32">
        <GameHistoryTable login={user?.login}></GameHistoryTable>
      </div>
    </>
  );
}

export default User;
