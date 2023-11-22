/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import chat_plus from '@/assets/chat/chat_plus.svg';
import chat_join from '@/assets/chat/join-channel.svg';

import CreateDM from './CreateDM';
import DMConversation from './DMConversation';
import DMList from './DMList';
import DMModal from './DMModal';
import JoinDM from './JoinDM';
import FriendList from '@/components/friends/FriendList';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { UseQueryResult } from 'react-query';

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

const DM = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const localToken = localStorage.getItem('token');
  const token: string = localToken ? localToken : '';
  const [loading, setLoading] = useState<boolean>(true);
  const [joinedChannels, setJoinedChannels] = useState<ChannelType[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelType | null>(null);
  const [currentFriend, setCurrentFriend] = useState<userDto | null>(null);

  const {
    data: friendList,
    isLoading,
    isError,
  } = useApi().get('get friend list', 'user/friends/friendlist') as UseQueryResult<userDto[]>;

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
        setCurrentChannel(data);
        setJoinedChannels((prev) => [...prev, data]);
      });

      tmpSocket.on('youLeft', (data: any) => {
        setCurrentChannel(null);
        setJoinedChannels(joinedChannels.filter((c) => c.name !== data.channel));
        alert(`You left ${data.channel}, ${data.reason}`);
      });

      tmpSocket.on('exception', (data) => {
        if (Array.isArray(data.DMMessage)) {
          alert(data.DMMessage.join('\n'));
        } else {
          alert(data.DMMessage);
        }
      });
    });

    return () => {
      socket?.disconnect();
    };
  }, []);
  if (loading) return <div>loading</div>;
  if (!socket) return <div>socket not initialized</div>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex max-h-full min-h-[75%] w-full bg-white-1 md:w-auto">
      {showCreateModal && (
        <DMModal>
          <CreateDM setShowModal={setShowCreateModal} socket={socket} />
        </DMModal>
      )}
      {showJoinModal && (
        <DMModal>
          <JoinDM setShowModal={setShowJoinModal} socket={socket} joinedChannels={joinedChannels} />
        </DMModal>
      )}
      <div className="flex w-[35%] flex-col md:w-auto">
        <div className="flex  justify-between px-1 py-3  md:gap-2 md:p-3">
          <h2 className="text-base md:text-xl">DMMessages</h2>
          <div className="flex w-full gap-1 md:gap-2">
            <button
              className="rounded-full p-1 hover:bg-white-3"
              title="Join a channel"
              onClick={() => setShowJoinModal(true)}
            >
              <img className="w-5 md:w-6" src={chat_join} alt="join channel" />
            </button>
            <button
              title="Create a channel"
              onClick={() => setShowCreateModal(true)}
              className="rounded-full p-1 hover:bg-white-3"
            >
              <img className="w-5 md:w-6" src={chat_plus} alt="create channel" />
            </button>
          </div>
        </div>
        <FriendList
          allFriends={friendList}
          setCurrentFriend={setCurrentFriend}
          currentFriend={currentFriend}
          joinedChannels={joinedChannels}
          setCurrentChannel={setCurrentChannel}
          currentChannel={currentChannel}
        />
      </div>
      {currentChannel && <DMConversation socket={socket} channel={currentChannel} />}
    </div>
  );
};

export default DM;
