import React, { useEffect, useRef, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { Socket } from 'socket.io-client';

import info_icon from '@/assets/chat/info.svg';
import send_icon from '@/assets/chat/send.svg';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

import { ChannelType } from './DM';
import DMInfos from './DMInfos';
import DMModal from './DMModal';
import DMMessage from './DMDMMessage';

interface DMConversationProps {
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

export interface DMMessageType {
  id: number;
  creadtedAt: string;
  content: string;
  user: UserType;
}

const DMDMConversation = ({ channel, socket }: DMConversationProps) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [DMMessages, setDMMessages] = useState<DMMessageType[]>([]);
  const [DMMessage, setDMMessage] = useState<string>('');
  const bottomEl = useRef<HTMLDivElement>(null);
  const {
    data: infos,
    isError,
    isLoading,
  } = useApi().get('get user infos', '/user/me') as UseQueryResult<userDto>;

  useEffect(() => {
    socket.on('DMMessage', (data: DMMessageType) => {
      setDMMessages((DMMessages) => [...DMMessages, data]);
    });

    socket.emit(
      'history',
      { channel: channel.name, offset: 0, limit: 100 },
      (res: DMMessageType[]) => {
        setDMMessages(res);
      },
    );

    return () => {
      socket.off('DMMessage');
    };
  }, [channel]);

  useEffect(() => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [DMMessages]);

  const sendDMMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!DMMessage) return;
    socket.emit('DMMessage', { channel: channel.name, content: DMMessage });
    setDMMessage('');
  };

  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;
  if (!infos) return <div>error</div>;

  return (
    <div className="flex w-[65%] flex-col border-l border-l-white-3 md:w-[500px]">
      {showModal && (
        <DMModal>
          <DMInfos
            setShowModal={setShowModal}
            socket={socket}
            channelName={channel.name}
            currentUserLogin={infos.login}
          />
        </DMModal>
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
        {DMMessages.map((m, idx) => {
          // TODO replace idx by DMMessage id
          return (
            <DMMessage
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
          onSubmit={(e) => sendDMMessage(e)}
        >
          <input
            className="w-full bg-white-3 outline-none"
            type="text"
            placeholder="Write a new DMMessage"
            value={DMMessage}
            onChange={(e) => setDMMessage(e.target.value)}
          />
          <button>
            <img className="w-5" src={send_icon} alt="send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DMDMConversation;
