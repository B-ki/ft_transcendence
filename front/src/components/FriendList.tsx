// import logo from '@/assets/logo.svg';

import React, { FormEvent, useRef } from 'react';
import { useMutation, UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';

import chat_add from '@/assets/chat/Group_add_light.png';
import background from '@/assets/low-poly-grid-haikei.svg';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { queryClient } from '@/main';
import { api } from '@/utils/api';

interface FriendListElemProps {
  currentFriend: userDto;
  me: userDto | undefined;
}

const FriendListElem = ({ me, currentFriend }: FriendListElemProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/user/${currentFriend.login}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-black-3 enabled:hover:bg-white flex w-56 cursor-pointer rounded-lg border border-dark-1 bg-white-2 p-3 enabled:hover:opacity-60 `}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-5">
          <img
            className="flex h-16 w-16 rounded-full "
            src={currentFriend.imagePath ? currentFriend.imagePath : currentFriend.intraImageURL}
          />
          <div>
            <h3 className="font-bold">
              {currentFriend?.displayName ? currentFriend?.displayName : currentFriend?.login}
            </h3>
            <div className="flex items-center justify-center gap-3">
              {currentFriend.status === 'ONLINE' ? (
                <React.Fragment>
                  <span>Online</span>
                  <div className="flex h-3 w-3 rounded-full bg-green-1"></div>
                </React.Fragment>
              ) : currentFriend.status === 'OFFLINE' ? (
                <React.Fragment>
                  <span>Offline</span>
                  <div className="flex h-3 w-3 rounded-full bg-red"></div>
                </React.Fragment>
              ) : currentFriend.status === 'INGAME' ? (
                <React.Fragment>
                  <span>In Game</span>
                  <div className="flex h-3 w-3 rounded-full bg-blue"></div>
                </React.Fragment>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

const FriendList = () => {
  const nameRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (login: string) => {
      return api.post('user/friends/add', { json: login });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get friend list'] });
    },
  });

  const {
    data: me,
    isLoading,
    isError,
  } = useApi().get('get me user', 'user/me') as UseQueryResult<userDto>;
  const { data: allUsers } = useApi().get('get all users', 'user/all') as UseQueryResult<userDto[]>;

  const { data: allFriends } = useApi().get(
    'get friend list',
    'user/friends/friendlist',
  ) as UseQueryResult<userDto[]>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userLogin = allUsers?.filter((user) => user.login === nameRef.current?.value);
    const userDisplayname = allUsers?.filter((user) => user.displayName === nameRef.current?.value);
    console.log('test');
    if (userLogin) mutation.mutate(userLogin[0].login);
    else if (userDisplayname) mutation.mutate(userDisplayname[0].login);
    else alert('No user with this name exists');
  };

  return (
    <div
      className="flex min-h-[65%]  w-60 flex-col gap-2 overflow-y-auto rounded-lg bg-white-2 p-2"
      style={{ maxHeight: '600px' }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-around">
          <input
            className="w-40 rounded-lg border-2 border-white-3 p-2"
            type="text"
            placeholder="Search a friend"
            ref={nameRef}
          ></input>
          <button className="rounded-full p-1 hover:bg-dark-3">
            <img className="w-5 md:w-6" src={chat_add} />
          </button>
        </div>
      </form>
      {allFriends?.map((user, index) => (
        <FriendListElem me={me} key={index} currentFriend={user} />
      ))}
    </div>
  );
};

export default FriendList;
