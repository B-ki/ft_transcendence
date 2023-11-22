import React, { useState } from 'react';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { FC } from 'react';
import { UseQueryResult } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { ChannelType } from './DM';
import { channel } from 'diagnostics_channel';

interface FriendListElemProps {
  friendInfos: userDto;
  currentFriend: userDto | null | undefined;
  setCurrentFriend: (friend: userDto) => void;
}

const FriendListElem = ({ friendInfos, setCurrentFriend, currentFriend }: FriendListElemProps) => {
  const handleClick = (friend: userDto) => {
    if (currentFriend === null || friend.login !== currentFriend?.login) {
      setCurrentFriend(friend);
    }
  };
  return (
    <button
      onClick={() => handleClick(friendInfos)}
      className={`flex w-full cursor-pointer p-3 enabled:hover:bg-white-2  ${
        currentFriend?.login === friendInfos.login && 'bg-white-3'
      }`}
      disabled={currentFriend?.login === friendInfos.login}
    >
      <div className="flex flex-col">
        <div className="flex w-56 items-center justify-around gap-2 px-4 py-2 text-xl hover:cursor-pointer enabled:hover:bg-white-2">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={friendInfos.imagePath ? friendInfos.imagePath : friendInfos.intraImageURL}
            alt="Profile picture"
          ></img>
          <div>
            <div className="font-bold">
              {friendInfos.displayName ? friendInfos.displayName : friendInfos.login}
            </div>
            <div className="flex items-center justify-center gap-2">
              {friendInfos.status === 'ONLINE' ? (
                <React.Fragment>
                  <div>Online</div>
                  <div className="flex h-3 w-3 rounded-full bg-green-1"></div>
                </React.Fragment>
              ) : friendInfos.status === 'OFFLINE' ? (
                <React.Fragment>
                  <div>Offline</div>
                  <div className="flex h-3 w-3 rounded-full bg-red"></div>
                </React.Fragment>
              ) : friendInfos.status === 'INGAME' ? (
                <React.Fragment>
                  <div>In Game</div>
                  <div className="flex h-3 w-3 rounded-full bg-blue"></div>
                </React.Fragment>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

interface FriendListProps {
  allFriends: userDto[] | undefined;
  currentFriend: userDto | null;
  setCurrentFriend: (friend: userDto) => void;
  joinedChannels: ChannelType[];
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
}

const FriendList = ({ allFriends, currentFriend, setCurrentFriend }: FriendListProps) => {
  return (
    <div className="h-full w-full">
      {allFriends ? (
        allFriends.map((friend, index) => (
          <FriendListElem
            key={index}
            setCurrentFriend={setCurrentFriend}
            friendInfos={friend}
            currentFriend={currentFriend}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default FriendList;
