/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

import chat_plus from '@/assets/chat/chat_plus.svg';
import chat_join from '@/assets/chat/join-channel.svg';
import lock from '@/assets/chat/lock.svg';

import ChatList from './ChatList';
import ChatModal from './ChatModal';
import Conversation from './Conversation';
import { Channel } from 'diagnostics_channel';

interface CreateChannelProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
}
interface Channel {
  name: string;
  type: string;
  password?: string;
}

const CreateChannel = ({ setShowModal, socket }: CreateChannelProps) => {
  const [channelType, setChannelType] = useState<string>('Public');
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const createChannel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // send notification if success or error
    const channel: Channel = {
      name: nameRef.current?.value || '',
      type: channelType.toUpperCase(),
    };
    if (channelType === 'protected') {
      channel.password = passwordRef.current?.value;
    }
    console.log('Creating channel', channel);
    // socket.emit('create', channel);
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
          ref={nameRef}
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
            ref={passwordRef}
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

export interface ChannelType {
  createdAt: string;
  id: number;
  name: string;
  type: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
}

const JoinChannel = ({ setShowModal, socket }: CreateChannelProps) => {
  const [searchChannel, setSearchChannel] = useState<string>('');
  const [isPasswordNeeded, setIsPasswordNeeded] = useState<boolean>(false);
  const [channelSelected, setChannelSelected] = useState<HTMLButtonElement | null>(null);
  const [channels, setChannels] = useState<ChannelType[]>([]);

  useEffect(() => {
    socket.emit('channelList', (data: ChannelType[]) => {
      console.log('Channel list', data);
      setChannels(data);
    });
  }, []);

  const selectChannel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.lastChild?.nodeName === 'IMG') {
      setIsPasswordNeeded(true);
    } else {
      setIsPasswordNeeded(false);
    }

    if (e.currentTarget !== channelSelected) {
      if (channelSelected) {
        channelSelected.style.backgroundColor = '#FFFFFF';
        channelSelected.style.color = '#000000';
      }
      e.currentTarget.style.backgroundColor = '#37626D';
      e.currentTarget.style.color = '#FFFFFF';
      setChannelSelected(e.currentTarget);
    }
  };

  const handleJoinChannel = () => {
    console.log('Joining channel');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white-2 p-6 shadow-xl">
      <h2 className="mb-4 text-2xl">Join a channel</h2>
      <form className="flex flex-col gap-2" onSubmit={handleJoinChannel}>
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
        <div className="flex max-h-[300px] flex-col gap-1 overflow-x-scroll">
          {channels
            .filter((channel) => channel.name.toLowerCase().includes(searchChannel.toLowerCase()))
            .map((channel) => {
              return (
                <button
                  className="flex justify-between gap-2 rounded-lg border-2 border-white-3 bg-white-1 p-2 enabled:hover:bg-darkBlue-2 enabled:hover:text-white-1 enabled:focus:bg-darkBlue-2 enabled:focus:text-white-1 disabled:cursor-not-allowed disabled:opacity-60"
                  key={channel.id}
                  disabled={false}
                  onClick={selectChannel}
                  type="button"
                >
                  <div>{channel.name}</div>
                  {false && <div className="text-darkBlue-2">Joined</div>}
                  {channel.type === 'PROTECTED' && (
                    <img className="mr-2 w-6 text-darkBlue-2" src={lock} alt="lock" />
                  )}
                </button>
              );
            })}
        </div>
        <div className="flex justify-center gap-2">
          <input
            className={`rounded-lg border-2 border-white-3 p-2 ${
              isPasswordNeeded ? '' : 'cursor-not-allowed'
            }`}
            type="password"
            placeholder="Password"
            required={isPasswordNeeded}
            disabled={!isPasswordNeeded}
          />
          <button className="w-full rounded-lg border-2 border-white-3 p-2 hover:bg-darkBlue-2 hover:text-white-1">
            Join
          </button>
        </div>
      </form>
    </div>
  );
};

const Chat = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const localToken = localStorage.getItem('token');
  const token: string = localToken ? localToken : '';
  const [loading, setLoading] = useState<boolean>(true);
  const [joinedChannels, setJoinedChannels] = useState<ChannelType[]>([]);

  useEffect(() => {
    setLoading(true);
    console.log('Initializing socket');
    const tmpSocket = io('/chat', { extraHeaders: { token: token } });
    tmpSocket.on('connect', () => {
      console.log('Connected to socket');
      setSocket(tmpSocket);
      setLoading(false);
      tmpSocket.emit('joinedChannels', (data: ChannelType[]) => {
        console.log('Joined channels', data);
        setJoinedChannels(data);
      });
      tmpSocket.onAny((data, event) => {
        console.log('Event:', event, data);
      });
    });

    return () => {
      console.log('Disconnecting socket');
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
          <JoinChannel setShowModal={setShowJoinModal} socket={socket} />
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
        <ChatList joinedChannels={joinedChannels} />
      </div>
      <Conversation />
    </div>
  );
};

export default Chat;
