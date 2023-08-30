import React from 'react';

import logo from '@/assets/logo.svg';

import ChatListElem from './ChatListElem';

// TODO: Loop over all the conversations
function ChatList() {
  const chats = [
    {
      id: 1,
      username: 'Arthur',
      login: 'apigeon',
      lastMessage: 'Hello you 👋',
      profilePicture: logo,
    },
    {
      id: 1,
      username: 'Arthur',
      login: 'apigeon',
      lastMessage: 'Hello you 👋',
      profilePicture: logo,
    },
    {
      id: 1,
      username: 'Arthur',
      login: 'apigeon',
      lastMessage: 'Hello you 👋',
      profilePicture: logo,
    },
    {
      id: 1,
      username: 'Arthur',
      login: 'apigeon',
      lastMessage: 'Hello you 👋',
      profilePicture: logo,
    },
  ];
  return (
    <div className="h-full w-full overflow-scroll">
      {chats.map((chat) => (
        <ChatListElem key={chat.id} chatInfos={chat} />
      ))}
    </div>
  );
}

export default ChatList;
