/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import chat_plus from '@/assets/chat/chat_plus.svg';
import chat_join from '@/assets/chat/join-channel.svg';

import ChatList from './ChatList';
import ChatModal from './ChatModal';
import Conversation from './Conversation';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';

export interface Channel {
  name: string;
  type: string;
  password?: string;
}

export interface ChannelType {
  createdAt: string;
  id: number;
  name: string;
  type: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
}

const Chat = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const localToken = localStorage.getItem('token');
  const token: string = localToken ? localToken : '';
  const [loading, setLoading] = useState<boolean>(true);
  const [joinedChannels, setJoinedChannels] = useState<ChannelType[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelType | null>(null);

  useEffect(() => {
    setLoading(true);
    const tmpSocket = io('/chat', { extraHeaders: { token: token } });
    tmpSocket.on('connect', () => {
      setSocket(tmpSocket);
      setLoading(false);

      tmpSocket.emit('joinedChannels', (data: ChannelType[]) => {
        setJoinedChannels(data);
      });

      tmpSocket.on('youJoined', (data: ChannelType) => {
        console.log('You joined', data);
        // TODO uncomment once this is done https://github.com/B-ki/ft_transcendence/issues/72
        // setCurrentChannel(data);
        // setJoinedChannels((prev) => [...prev, data]);
      });
    });

    return () => {
      socket?.disconnect();
    };
  }, []);
  if (loading) return <div>loading</div>;
  if (!socket) return <div>socket not initialized</div>;

  return (
    <div className="flex max-h-full min-h-[75%] bg-white-1">
      {showCreateModal && (
        <ChatModal>
          <CreateChannel setShowModal={setShowCreateModal} socket={socket} />
        </ChatModal>
      )}
      {showJoinModal && (
        <ChatModal>
          <JoinChannel
            setShowModal={setShowJoinModal}
            socket={socket}
            joinedChannels={joinedChannels}
          />
        </ChatModal>
      )}
      <div className="flex flex-col">
        <div className="flex justify-between gap-2 p-3">
          <h2 className="text-xl">Messages</h2>
          <div className="flex gap-2">
            <button
              className="rounded-full p-1 hover:bg-white-3"
              title="Join a channel"
              onClick={() => setShowJoinModal(true)}
            >
              <img className="w-6" src={chat_join} alt="join channel" />
            </button>
            <button
              title="Create a channel"
              onClick={() => setShowCreateModal(true)}
              className="rounded-full p-1 hover:bg-white-3"
            >
              <img className="w-6" src={chat_plus} alt="create channel" />
            </button>
          </div>
        </div>
        <ChatList
          joinedChannels={joinedChannels}
          setCurrentChannel={setCurrentChannel}
          currentChannel={currentChannel}
        />
      </div>
      {currentChannel && <Conversation socket={socket} channel={currentChannel} />}
    </div>
  );
};

export default Chat;
