/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, ReactEventHandler, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

import chat_plus from '@/assets/chat/chat_plus.svg';
import chat_join from '@/assets/chat/join-channel.svg';

import ChatList from './ChatList';
import Conversation from './Conversation';

interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  return (
    <div className="absolute left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white-3/30">
      {children}
    </div>
  );
};

interface CreateChannelProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChannel = ({ setShowModal }: CreateChannelProps) => {
  const [channelType, setChannelType] = useState<string>('Public');

  const createChannel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Creating channel');
    // send notification if success or error
    setShowModal(false);
  };
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white-2 p-6 shadow-xl">
      <h2 className="mb-4 text-2xl">Create a channel</h2>
      <form className="flex flex-col gap-2" onSubmit={createChannel}>
        <input
          pattern="[a-z0-9]+"
          title="Only lowercase letters and numbers are allowed"
          className="rounded-lg border-2 border-white-3 p-2"
          type="text"
          placeholder="Channel name"
        />
        <select
          className="rounded-lg border-2 border-white-3 p-2"
          onChange={(e) => setChannelType(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="protected">Protected</option>
          <option value="private">Private</option>
        </select>
        {channelType === 'protected' && (
          <input
            className="rounded-lg border-2 border-white-3 p-2"
            type="password"
            placeholder="Password"
          />
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg border-2 border-white-3 p-2 hover:bg-red hover:text-white-1"
          >
            Cancel
          </button>
          <button className="rounded-lg border-2 border-white-3 p-2 hover:bg-darkBlue-2 hover:text-white-1">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

const JoinChannel = ({ setShowModal }: CreateChannelProps) => {
  const channels = [
    {
      id: 1,
      name: 'Channel 1',
      type: 'public',
      joined: true,
    },
    {
      id: 2,
      name: 'Channel 2',
      type: 'protected',
      joined: false,
    },
    {
      id: 3,
      name: 'Channel 3',
      type: 'public',
      joined: false,
    },
    {
      id: 4,
      name: 'Channel 4',
      type: 'public',
      joined: false,
    },
  ];
  const [searchChannel, setSearchChannel] = useState('');

  const selectChannel = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Selecting channel', e);
    // send notification if success or error
    // setShowModal(false);
  };
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white-2 p-6 shadow-xl">
      <h2 className="mb-4 text-2xl">Join a channel</h2>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="rounded-lg border-2 border-white-3 p-2"
            type="text"
            placeholder="Filter channel"
            onChange={(e) => setSearchChannel(e.target.value)}
          />
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg border-2 border-white-3 p-2 hover:bg-red hover:text-white-1"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {channels
            .filter((channel) => channel.name.includes(searchChannel))
            .map((channel) => {
              return (
                <button
                  className="flex justify-between gap-2 rounded-lg border-2 border-white-3 bg-white-1 p-2 enabled:hover:bg-darkBlue-2 enabled:hover:text-white-1 disabled:cursor-not-allowed disabled:opacity-60"
                  key={channel.id}
                  disabled={channel.joined}
                  onClick={selectChannel}
                >
                  <div>{channel.name}</div>
                  {channel.joined && <div className="text-darkBlue-2">Joined</div>}
                </button>
              );
            })}
        </div>
        <div className="flex justify-center gap-2">
          <input
            className="rounded-lg border-2 border-white-3 p-2"
            type="password"
            placeholder="Password"
          />
          <button className="w-full rounded-lg border-2 border-white-3 p-2 hover:bg-darkBlue-2 hover:text-white-1">
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  // let socket: Socket = io();
  // const localToken = localStorage.getItem('token');
  // const token: string = localToken ? localToken : '';
  // const [error, setError] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [messages, setMessages] = useState<any[]>([]);
  // const [currentMessage, setCurrentMessage] = useState<string | object>('');

  // const sendMessage = (content: string | object) => {
  //   console.log('Sending message', content);
  //   socket.emit('channelList', (data) => {
  //     console.log('Received the event', data);
  //   });
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   console.log('Initializing socket');
  //   socket = io('/chat', { extraHeaders: { token: token } });
  //   socket.on('connect_error', (err) => {
  //     console.log('Connection error', err);
  //     setError(true);
  //   });
  //   socket.onAny((event, ...args) => {
  //     console.log('Received the event', event, args);
  //     setMessages((prevMessages) => [...prevMessages, args]);
  //   });
  //   setLoading(false);
  //   return () => {
  //     console.log('Disconnecting socket');
  //     socket.disconnect();
  //   };
  // }, []);
  // if (loading) return <div>loading</div>;

  return (
    <div className="flex max-h-full min-h-[75%] bg-white-1">
      {showCreateModal && (
        <Modal>
          <CreateChannel setShowModal={setShowCreateModal} />
        </Modal>
      )}
      {showJoinModal && (
        <Modal>
          <JoinChannel setShowModal={setShowJoinModal} />
        </Modal>
      )}
      <div className="flex flex-col">
        <div className="flex justify-between p-3">
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
        <ChatList />
      </div>
      <Conversation />
    </div>
  );
};

export default Chat;
