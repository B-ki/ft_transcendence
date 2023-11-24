/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { io, Socket } from 'socket.io-client';

import chat_channel from '@/assets/chat/Chat.svg';
import chat_plus from '@/assets/chat/chat_plus.svg';
import chat_DM from '@/assets/chat/comment.svg';
import chat_add from '@/assets/chat/Group_add_light.png';
import chat_join from '@/assets/chat/join-channel.svg';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

import ChatList from './ChatList';
import ChatModal from './ChatModal';
import Conversation from './Conversation';
import CreateChannel from './CreateChannel';
import DmCreate from './DmCreate';
import DmConversation from './DmConversation';
import DmList from './DmList';
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
  isDM: boolean;
}

const Chat = () => {
  const [showCreateChannelModal, setShowCreateChannelModal] = useState<boolean>(false);
  const [showJoinChannelModal, setShowJoinChannelModal] = useState<boolean>(false);
  const [showDmSomeoneModal, setShowDmSomeoneModal] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const localToken = localStorage.getItem('token');
  const token: string = localToken ? localToken : '';
  const [loading, setLoading] = useState<boolean>(true);
  const [joinedChannels, setJoinedChannels] = useState<ChannelType[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelType | null>(null);
  const [showChannels, setShowChannels] = useState<boolean>(false);
  let me: userDto | undefined;

  const { data: user } = useApi().get('get user infos', '/user/me') as UseQueryResult<userDto>;

  const {
    data: users,
    isLoading,
    isError,
  } = useApi().get('get all users', 'user/all') as UseQueryResult<userDto[]>;

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
        console.log('youJoined - channel list :', joinedChannels);
      });

      tmpSocket.on('exception', (data) => {
        if (Array.isArray(data.message)) {
          alert(data.message.join('\n'));
        } else {
          alert(data.message);
        }
      });
    });

    return () => {
      socket?.off('youJoined');
      socket?.off('exception');
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on('youLeft', (data: any) => {
      setCurrentChannel(null);
      setJoinedChannels(joinedChannels.filter((c) => c.name !== data.channel));
      if (!data.reason.includes('disconnected')) {
        alert(`You left ${data.channel}, ${data.reason}`);
      }
    });

    return () => {
      socket?.off('youLeft');
    };
  }, [joinedChannels]);

  if (loading) return <div>loading</div>;
  if (!socket) return <div>socket not initialized</div>;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  me = user;

  const handleShowChannels = (boolean: boolean) => {
    setCurrentChannel(null);
    setShowChannels(boolean);
  };

  return (
    <div className="flex max-h-full min-h-[65%] w-full rounded-lg bg-white-1 md:w-auto">
      {showCreateChannelModal && (
        <ChatModal>
          <CreateChannel setShowModal={setShowCreateChannelModal} socket={socket} />
        </ChatModal>
      )}
      {showJoinChannelModal && (
        <ChatModal>
          <JoinChannel
            setShowModal={setShowJoinChannelModal}
            socket={socket}
            joinedChannels={joinedChannels}
          />
        </ChatModal>
      )}
      {showDmSomeoneModal && (
        <ChatModal>
          <DmCreate
            setCurrentChannel={setCurrentChannel}
            setShowModal={setShowDmSomeoneModal}
            socket={socket}
            users={users?.filter((user) => user.login !== me?.login)}
          />
        </ChatModal>
      )}
      {showChannels ? (
        <div className="flex w-[35%] flex-col md:w-auto">
          <div className="flex  justify-between px-1 py-3  md:gap-2 md:p-3">
            <h2 className="text-base md:text-xl">Channels</h2>
            <div className="flex w-full gap-1 md:gap-2">
              <button
                className="rounded-full p-1 hover:bg-white-3"
                title="Go to direct messages"
                onClick={() => handleShowChannels(false)}
              >
                <img className="w-5 md:w-6" src={chat_channel} alt="Direct messages" />
              </button>
              <button
                className="rounded-full p-1 hover:bg-white-3"
                title="Join a channel"
                onClick={() => setShowJoinChannelModal(true)}
              >
                <img className="w-5 md:w-6" src={chat_join} alt="join channel" />
              </button>
              <button
                title="Create a channel"
                onClick={() => setShowCreateChannelModal(true)}
                className="rounded-full p-1 hover:bg-white-3"
              >
                <img className="w-5 md:w-6" src={chat_plus} alt="create channel" />
              </button>
            </div>
          </div>
          <ChatList
            joinedChannels={joinedChannels.filter((c) => c.isDM === false)}
            setCurrentChannel={setCurrentChannel}
            currentChannel={currentChannel}
          />
        </div>
      ) : (
        <div className="flex w-[35%] flex-col md:w-auto">
          <div className="flex  justify-between px-1 py-3  md:gap-2 md:p-3">
            <h2 className="text-base md:text-xl">Direct message</h2>
            <div className="flex w-full justify-center gap-1 md:gap-2">
              <button
                className="rounded-full p-1 hover:bg-white-3"
                title="Go to channels"
                onClick={() => handleShowChannels(true)}
              >
                <img className="w-5 md:w-6" src={chat_DM} alt="Channels" />
              </button>
              <button
                className="rounded-full p-1 hover:bg-white-3"
                title="Find someone"
                onClick={() => setShowDmSomeoneModal(true)}
              >
                <img className="w-5 md:w-6" src={chat_add} alt="Find someone" />
              </button>
            </div>
          </div>
          <DmList
            me={me}
            allUsers={users?.filter((user) => user.login !== me?.login)}
            joinedChannels={joinedChannels.filter((c) => c.isDM === true)}
            setCurrentChannel={setCurrentChannel}
            currentChannel={currentChannel}
          />
        </div>
      )}
      {showChannels
        ? currentChannel && <Conversation me={me} socket={socket} channel={currentChannel} />
        : currentChannel && (
            <DmConversation
              allUsers={users?.filter((user) => user.login !== me?.login)}
              me={me}
              socket={socket}
              channel={currentChannel}
            />
          )}
    </div>
  );
};

export default Chat;
