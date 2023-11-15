/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import ChatList from './ChatList';
import Conversation from './Conversation';

// const token = localStorage.getItem('token');
const socket = io('/chat');
const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  // const [currentMessage, setCurrentMessage] = useState<string | object>('');

  const sendMessage = (content: string | object) => {
    console.log('Sending message', content);
    socket.emit('channelList', { name: 'Nest' });
  };

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log('Go event', event, args);
      setMessages((prevMessages) => [...prevMessages, args]);
    });
  }, []);

  return (
    <div className="flex max-h-full min-h-[75%] bg-white-1">
      <div className="flex flex-col">
        <div>
          <h2 className="p-3 text-xl">Messages</h2>
        </div>
        <ChatList />
      </div>
      <Conversation sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
