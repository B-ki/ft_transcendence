// import logo from '@/assets/logo.svg';

import { HTTPError } from 'ky';
import React, { useRef } from 'react';
import { useMutation, UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';

import close_icon from '@/assets/chat/close.svg';
import chat_add from '@/assets/chat/Group_add_light.png';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { queryClient } from '@/main';
import { api } from '@/utils/api';

interface FriendListElemProps {
  currentFriend: userDto;
}

const FriendListElem = ({ currentFriend }: FriendListElemProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/user/${currentFriend.login}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex w-56 cursor-pointer rounded-lg border border-dark-1 bg-white-2 p-3 enabled:hover:opacity-60 `}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-5">
          <img
            className="flex h-16 w-16 rounded-full "
            src={currentFriend.imagePath ? currentFriend.imagePath : currentFriend.intraImageURL}
            alt="profile"
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

  const addFriendMutation = useMutation({
    mutationFn: (login: string) => {
      return api.post('user/friends/add', { json: { login: login } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get friend list'] });
    },
    onError: async (err: HTTPError) => {
      const response = await err.response.json();
      alert(response.message);
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: (login: string) => {
      return api.post('user/friends/remove', { json: { login: login } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get friend list'] });
    },
    onError: async (err: HTTPError) => {
      const response = await err.response.json();
      alert(response.message);
    },
  });

  const { data: allFriends } = useApi().get(
    'get friend list',
    'user/friends/friendlist',
  ) as UseQueryResult<userDto[]>;

  const addFriend = () => {
    const userLogin = nameRef.current?.value;
    if (userLogin) {
      addFriendMutation.mutate(userLogin);
    }
  };

  const removeFriend = () => {
    const userLogin = nameRef.current?.value;
    if (userLogin) {
      removeFriendMutation.mutate(userLogin);
    }
  };

  return (
    <div
      className="flex min-h-[65%]  w-64 flex-col gap-2 overflow-y-auto rounded-lg bg-white-2 p-2"
      style={{ maxHeight: '600px' }}
    >
      <div className="flex items-center justify-around">
        <input
          className="w-40 rounded-lg border-2 border-white-3 p-2"
          type="text"
          placeholder="Search a friend"
          ref={nameRef}
        ></input>
        <button
          className="rounded-full p-1 hover:bg-white-3"
          title="Add friend"
          onClick={addFriend}
        >
          <img className="w-5 md:w-6" src={chat_add} alt="add friend" />
        </button>
        <button
          className="rounded-full p-1 hover:bg-white-3"
          title="Remove friend"
          onClick={removeFriend}
        >
          <img className="w-5 md:w-6" src={close_icon} alt="remove friend" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        {allFriends?.map((user, index) => <FriendListElem key={index} currentFriend={user} />)}
      </div>
    </div>
  );
};

export default FriendList;
