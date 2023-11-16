import React, { useRef } from 'react';
import { UseQueryResult } from 'react-query';

import send_icon from '@/assets/chat/send.svg';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

import Message from './Message';

const messages = [
  {
    id: 1,
    sender: 'apigeon',
    datetime: '2023-10-13T14:00:00.000Z',
    content: 'Hello you 👋',
  },
  {
    id: 2,
    sender: 'apigeon',
    datetime: '2023-10-13T14:02:00.000Z',
    content: 'What are you doing ?',
  },
  {
    id: 3,
    sender: 'rmorel',
    datetime: '2023-10-13T15:02:00.000Z',
    content: 'Hey man !',
  },
  {
    id: 4,
    sender: 'rmorel',
    datetime: '2023-10-13T15:02:00.000Z',
    content: 'Just playing some league and you ?',
  },
];

interface ConversationProps {
  sendMessage?: (content: string | object) => void;
}

const Conversation = ({ sendMessage }: ConversationProps) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const {
    data: infos,
    isError,
    isLoading,
  } = useApi().get('get user infos', '/user/me') as UseQueryResult<userDto>;
  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;

  return (
    <div className="flex w-[500px] flex-col border-l border-l-white-3">
      <h3 className="p-3 text-xl">Title</h3>
      <div className="flex h-full flex-col justify-end gap-1 p-3">
        {messages.map((message) => {
          return (
            <Message
              key={message.id}
              text={message.content}
              send_by_user={message.sender === infos?.login}
              sender={message.sender}
            />
          );
        })}
      </div>
      <div className="border-t border-t-white-3">
        <div className="m-2 flex gap-3 rounded-2xl bg-white-3 p-2">
          <input
            className="w-full bg-white-3 outline-none"
            type="text"
            placeholder="ecrire un nouveau message"
            ref={messageRef}
          />
          <button
            onClick={() => {
              sendMessage(messageRef.current?.value as string);
            }}
          >
            <img className="w-5" src={send_icon} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
