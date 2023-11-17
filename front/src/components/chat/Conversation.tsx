import React, { useRef } from 'react';
import { UseQueryResult } from 'react-query';

import kick_icon from '@/assets/chat/ban.svg';
import game_icon from '@/assets/chat/boxing-glove.svg';
import close_icon from '@/assets/chat/close.svg';
import promote_icon from '@/assets/chat/crown.svg';
import info_icon from '@/assets/chat/info.svg';
import send_icon from '@/assets/chat/send.svg';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

import ChatModal from './ChatModal';
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
    content: 'Just haaangiiiing around',
  },
];

const users = [
  {
    id: 1,
    name: 'apigeon',
  },
  {
    id: 2,
    name: 'apigeon',
  },
  {
    id: 3,
    name: 'apigeon',
  },
  {
    id: 4,
    name: 'apigeon',
  },
];

interface ChatInfosProps {
  setShowModal: (show: boolean) => void;
}

const ChatInfos = ({ setShowModal }: ChatInfosProps) => {
  // Contains the list of members in the channel, whith a possibility to kick them, to promote them as admin, and to start a game with them
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white-1 p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl">Members</h2>
        <button
          onClick={() => setShowModal(false)}
          className="rounded-lg border-2 border-white-3 p-1 text-xl hover:bg-red hover:text-white-1"
        >
          Close
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {users.map((user) => {
          return (
            <div key={user.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src="https://picsum.photos/200" alt="user" />
                <h3 className="text-lg">{user.name}</h3>
              </div>
              <div className="flex gap-2">
                <button className="hover:bg-green-1 rounded-full p-1" title="Start a game">
                  <img className="w-6" src={game_icon} alt="close" />
                </button>
                <button className="hover:bg-yellow-1 rounded-full p-1" title="Promote to admin">
                  <img className="w-6" src={promote_icon} alt="info" />
                </button>
                <button className="rounded-full p-1 hover:bg-red" title="Kick user">
                  <img className="w-6" src={kick_icon} alt="info" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ConversationProps {
  sendMessage?: (content: string | object) => void;
}

const Conversation = ({ sendMessage }: ConversationProps) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const {
    data: infos,
    isError,
    isLoading,
  } = useApi().get('get user infos', '/user/me') as UseQueryResult<userDto>;
  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;

  return (
    <div className="flex w-[500px] flex-col border-l border-l-white-3">
      {showModal && (
        <ChatModal>
          <ChatInfos setShowModal={setShowModal} />
        </ChatModal>
      )}
      <div className="flex justify-between p-3">
        <h3 className="text-xl">Title</h3>
        <div className="flex gap-2">
          <button className="rounded-full p-1 hover:bg-white-3" onClick={() => setShowModal(true)}>
            <img className="w-6" src={info_icon} alt="info" />
          </button>
        </div>
      </div>
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
