// import logo from '@/assets/logo.svg';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { UseQueryResult } from 'react-query';
import { Socket } from 'socket.io-client';

import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

import { ChannelType } from './Chat';

interface DmListElemProps {
  allUsers: userDto[] | undefined;
  chatInfos: ChannelType;
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
  me: userDto | undefined;
}

const DmListElem = ({
  chatInfos,
  setCurrentChannel,
  currentChannel,
  allUsers,
  me,
}: DmListElemProps) => {
  const handleClick = (channel: ChannelType) => {
    if (currentChannel === null || channel.id !== currentChannel.id) setCurrentChannel(channel);
  };
  let user;

  function findUserInfos(chatName: string) {
    if (!chatName) return '';

    const { data: users } = useApi().get('get all users', 'user/all') as UseQueryResult<userDto[]>;

    const names = chatName.substring(1).split('_');
    if (names[0] === me?.login) {
      const user = users?.filter((user) => user.login === names[1]);
      if (user?.length) {
        return user[0].displayName ? user[0].displayName : user[0]?.login;
      } else {
        return names[1];
      }
    } else {
      const user = users?.filter((user) => user.login === names[0]);
      if (user?.length) {
        return user[0].displayName ? user[0].displayName : user[0]?.login;
      } else {
        return names[0];
      }
    }
  }

  return (
    <button
      onClick={() => handleClick(chatInfos)}
      className={`flex w-full cursor-pointer p-3 enabled:hover:bg-white-2 ${
        currentChannel?.name === chatInfos.name && 'bg-white-3'
      }`}
      disabled={currentChannel?.name === chatInfos.name}
    >
      {/* <img src={chatInfos.profilePicture} alt="conversation" className="h-14 w-14 rounded-full" /> */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h3 className="font-bold">{findUserInfos(chatInfos.name)}</h3>
          {/* <h3 className="text-sm">@{chatInfos.login}</h3> */}
        </div>
        {/* <span className="text-sm">{chatInfos.lastMessage}</span> */}
      </div>
    </button>
  );
};

interface DmListProps {
  allUsers: userDto[] | undefined;
  joinedChannels: ChannelType[];
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
  me: userDto | undefined;
  socket: Socket;
  setJoinedChannels: Dispatch<SetStateAction<ChannelType[]>>;
}

const DmList = ({
  joinedChannels,
  currentChannel,
  setCurrentChannel,
  allUsers,
  me,
  socket,
  setJoinedChannels,
}: DmListProps) => {
  return (
    <div className="h-full w-full overflow-y-auto" style={{ maxHeight: '600px' }}>
      {joinedChannels.map((chat) => (
        <DmListElem
          me={me}
          setCurrentChannel={setCurrentChannel}
          allUsers={allUsers}
          key={chat.id}
          chatInfos={chat}
          currentChannel={currentChannel}
        />
      ))}
    </div>
  );
};

export default DmList;
