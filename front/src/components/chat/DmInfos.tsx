import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import game_icon from '@/assets/chat/boxing-glove.svg';

import ChatModal from './ChatModal';
import { UserType } from './DmConversation';

interface DmInfosProps {
  setShowModal: (show: boolean) => void;
  socket: Socket;
  channelName: string;
  currentUserLogin: string | undefined;
}

interface UserListResponse {
  channel: string;
  users: UserType[];
}

// TODO: leaver button ??
const DmInfos = ({ setShowModal, socket, channelName, currentUserLogin }: DmInfosProps) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showMuteModal, setShowMuteModal] = useState<boolean>(false);
  const muteDurationRef = useRef<HTMLInputElement>(null);
  const muteReasonRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.emit('userList', { channel: channelName }, (res: UserListResponse) => {
      setUsers(res.users.filter((user) => user.login !== currentUserLogin));
      const user = res.users.find((user) => user.login === currentUserLogin) || null;
      if (user && (user.role === 'ADMIN' || user.role === 'OWNER')) setIsAdmin(true);
    });
  }, []);

  const muteUser = (e: React.FormEvent<HTMLFormElement>, user: UserType) => {
    e.preventDefault();

    const muteData = {
      channel: channelName,
      login: user.login,
      reason: muteReasonRef.current?.value,
      duration: Number(muteDurationRef.current?.value),
    };

    socket.emit('mute', muteData);
  };

  const startGame = () => {
    const code = (Math.random() + 1).toString(36).substring(7);
    const message = `Come join me in a Pong game! ${window.location.origin}/game?code=${code}`;
    socket.emit('message', { channel: channelName, content: message });
  };

  // Contains the list of members in the channel, whith a possibility to kick them, to promote them as admin, and to start a game with them
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white-1 p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl">User</h2>
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
              <Link to={'/user/' + user.login}>
                <div className="flex items-center gap-2">
                  <img className="w-8 rounded-full" src={user.intraImageURL} alt="user" />
                  <h3 className="text-lg">{user.login}</h3>
                </div>
              </Link>
              <div className="flex gap-2">
                <button
                  className="rounded-full p-1 hover:bg-green-1"
                  title="Start a game"
                  onClick={() => startGame()}
                >
                  <img className="w-6" src={game_icon} alt="close" />
                </button>
                {showMuteModal && (
                  <ChatModal>
                    <div className="flex flex-col gap-2 rounded-lg bg-white-1 p-4">
                      <div className="flex flex-col items-center justify-between gap-4">
                        <h2 className="text-2xl">Mute user</h2>
                        <form className="flex flex-col gap-2" onSubmit={(e) => muteUser(e, user)}>
                          <input
                            className="rounded-lg border-2 border-white-3 p-2"
                            placeholder="Mute duration in seconds"
                            ref={muteDurationRef}
                            required
                          ></input>
                          <input
                            className="rounded-lg border-2 border-white-3 p-2"
                            placeholder="Mute reason (optional)"
                            ref={muteReasonRef}
                          ></input>
                          <div className="flex justify-between">
                            <button
                              onClick={() => setShowMuteModal(false)}
                              className="rounded-lg border-2 border-white-3 p-2 hover:bg-red hover:text-white-1"
                            >
                              Cancel
                            </button>
                            <button className="rounded-lg border-2 border-white-3 p-2 hover:bg-darkBlue-2 hover:text-white-1">
                              Mute
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="flex flex-col gap-2"></div>
                    </div>
                  </ChatModal>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DmInfos;
