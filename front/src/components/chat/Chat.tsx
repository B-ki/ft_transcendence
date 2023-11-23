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
import DmChannel from './DmChannel';
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
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [showDmModal, setShowDmModal] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const localToken = localStorage.getItem('token');
  const token: string = localToken ? localToken : '';
  const [loading, setLoading] = useState<boolean>(true);
  const [joinedChannels, setJoinedChannels] = useState<ChannelType[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelType | null>(null);
  const [currentUser, setCurrentUser] = useState<userDto | null>(null);
  const [show, setShow] = useState<boolean>(false);
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
      });

      tmpSocket.on('youLeft', (data: any) => {
        setCurrentChannel(null);
        setJoinedChannels(joinedChannels.filter((c) => c.name !== data.channel));
        if (!data.reason.includes('disconnected')) {
          alert(`You left ${data.channel}, ${data.reason}`);
        }
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
  me = user;

  const handleShowDm = (boolean: boolean) => {
    setCurrentChannel(null);
    setShow(boolean);
  };

  return (
    <div className="flex max-h-full min-h-[65%] w-full rounded-lg bg-white-1 md:w-auto">
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
      {showDmModal && (
        <ChatModal>
          <DmChannel
            setCurrentChannel={setCurrentChannel}
            setShowModal={setShowDmModal}
            socket={socket}
            users={users?.filter((user) => user.login !== me?.login)}
          />
        </ChatModal>
      )}
      {show ? (
        <div className="flex w-[35%] flex-col md:w-auto">
          <div className="flex  justify-between px-1 py-3  md:gap-2 md:p-3">
            <h2 className="text-base md:text-xl">Channels</h2>
            <div className="flex w-full gap-1 md:gap-2">
              <button
                className="rounded-full p-1 hover:bg-white-3"
                title="Go to direct messages"
                onClick={() => handleShowDm(false)}
              >
                <img className="w-5 md:w-6" src={chat_channel} alt="Direct messages" />
              </button>
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
                onClick={() => handleShowDm(true)}
              >
                <img className="w-5 md:w-6" src={chat_DM} alt="Channels" />
              </button>
              <button
                className="rounded-full p-1 hover:bg-white-3"
                title="Find someone"
                onClick={() => setShowDmModal(true)}
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
      {show
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
