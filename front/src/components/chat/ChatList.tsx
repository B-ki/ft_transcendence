import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';

import logo from '@/assets/logo.svg';

interface ChatListElemProps {
  chatInfos: {
    username: string;
    login: string;
    profilePicture: string;
    lastMessage: string;
  };
}

const chats = [
  {
    id: 1,
    username: 'Arthur',
    login: 'apigeon',
    lastMessage: 'Hello you 👋',
    profilePicture: logo,
  },
  {
    id: 2,
    username: 'Arthur',
    login: 'apigeon',
    lastMessage: 'Hello you 👋',
    profilePicture: logo,
  },
  {
    id: 3,
    username: 'Arthur',
    login: 'apigeon',
    lastMessage: 'Hello you 👋',
    profilePicture: logo,
  },
  {
    id: 4,
    username: 'Arthur',
    login: 'apigeon',
    lastMessage: 'Hello you 👋',
    profilePicture: logo,
  },
];

// TODO: take props for the conversation
const ChatListElem = ({ chatInfos }: ChatListElemProps) => {
  return (
    <div className="flex w-full cursor-pointer p-3 hover:bg-white-2">
      <img src={chatInfos.profilePicture} alt="conversation" className="h-14 w-14 rounded-full" />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h3 className="font-bold">{chatInfos.username}</h3>
          <h3 className="text-sm">@{chatInfos.login}</h3>
        </div>
        <span className="text-sm">{chatInfos.lastMessage}</span>
      </div>
    </div>
  );
};

interface ChatListProps {
  socket?: Socket;
}

const ChatList = ({ socket }: ChatListProps) => {
  // useEffect(() => {
  //   console.log('Fetching conversations');
  //   socket.emit('channelList', '', (data) => {
  //     console.log(data);
  //   });
  // }, []);
  return (
    <div className="h-full w-full">
      {chats.map((chat) => (
        <ChatListElem key={chat.id} chatInfos={chat} />
      ))}
    </div>
  );
};

export default ChatList;
