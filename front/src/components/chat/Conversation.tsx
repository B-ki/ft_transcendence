import React, { useEffect, useRef, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { Socket } from 'socket.io-client';

import info_icon from '@/assets/chat/info.svg';
import send_icon from '@/assets/chat/send.svg';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

import { ChannelType } from './Chat';
import ChatInfos from './ChatInfos';
import ChatModal from './ChatModal';
import Message from './Message';

interface ConversationProps {
  channel: ChannelType;
  socket: Socket;
}

export interface UserType {
  id: number;
  login: string;
  status: string;
  intraImageURL: string;
  role: string;
}

export interface MessageType {
  id: number;
  creadtedAt: string;
  content: string;
  user: UserType;
}

const Conversation = ({ channel, socket }: ConversationProps) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<string>('');
  const bottomEl = useRef<HTMLDivElement>(null);
  const {
    data: infos,
    isError,
    isLoading,
  } = useApi().get('get user infos', '/user/me') as UseQueryResult<userDto>;

  useEffect(() => {
    socket.on('message', (data: MessageType) => {
      setMessages((messages) => [...messages, data]);
    });

    socket.emit(
      'history',
      { channel: channel.name, offset: 0, limit: 100 },
      (res: MessageType[]) => {
        setMessages(res);
      },
    );

    return () => {
      socket.off('message');
    };
  }, [channel]);

  useEffect(() => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    socket.emit('message', { channel: channel.name, content: message });
    setMessage('');
  };

  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;
  if (!infos) return <div>error</div>;

  return (
    <div className="flex w-[65%] flex-col border-l border-l-white-3 md:w-[500px]">
      {showModal && (
        <ChatModal>
          <ChatInfos
            setShowModal={setShowModal}
            socket={socket}
            channelName={channel.name}
            currentUserLogin={infos.login}
          />
        </ChatModal>
      )}
      <div className="flex justify-between p-3">
        <h3 className="text-xl">{channel.name}</h3>
        <div className="flex gap-2">
          <button className="rounded-full p-1 hover:bg-white-3" onClick={() => setShowModal(true)}>
            <img className="w-6" src={info_icon} alt="info" />
          </button>
        </div>
      </div>
      <div
        className="flex h-full flex-col gap-1 overflow-y-auto p-3"
        style={{ maxHeight: '600px' }}
      >
        {messages.map((m, idx) => {
          // TODO replace idx by message id
          return (
            <Message
              key={idx}
              text={m.content}
              send_by_user={m.user.login === infos?.login}
              sender={m.user}
            />
          );
        })}
        <div ref={bottomEl}></div>
      </div>
      <div className="border-t border-t-white-3">
        <form
          className="m-2 flex gap-3 rounded-2xl bg-white-3 p-2"
          onSubmit={(e) => sendMessage(e)}
        >
          <input
            className="w-full bg-white-3 outline-none"
            type="text"
            placeholder="Write a new message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button>
            <img className="w-5" src={send_icon} alt="send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
