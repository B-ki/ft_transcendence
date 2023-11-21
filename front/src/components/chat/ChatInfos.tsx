import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import ban_icon from '@/assets/chat/ban.svg';
import kick_icon from '@/assets/chat/kick.svg';
import game_icon from '@/assets/chat/boxing-glove.svg';
import promote_icon from '@/assets/chat/crown.svg';
import demote_icon from '@/assets/chat/demote.svg';

import { UserType } from './Conversation';

interface ChatInfosProps {
  setShowModal: (show: boolean) => void;
  socket: Socket;
  channelName: string;
  currentUserLogin: string;
}

interface UserListResponse {
  channel: string;
  users: UserType[];
}

// TODO: leaver button ??
const ChatInfos = ({ setShowModal, socket, channelName, currentUserLogin }: ChatInfosProps) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    socket.emit('userList', { channel: channelName }, (res: UserListResponse) => {
      setUsers(res.users.filter((user) => user.login !== currentUserLogin));
      const user = res.users.find((user) => user.login === currentUserLogin) || null;
      if (user && (user.role === 'ADMIN' || user.role === 'OWNER')) setIsAdmin(true);
    });
  }, []);

  const promoteUser = (user: UserType) => {
    socket.emit('promote', { channel: channelName, login: user.login });
    setUsers(
      users.map((u) => {
        if (u.id === user.id) {
          return { ...u, role: 'ADMIN' };
        }
        return u;
      }),
    );
  };

  const demoteUser = (user: UserType) => {
    socket.emit('demote', { channel: channelName, login: user.login });
    setUsers(
      users.map((u) => {
        if (u.id === user.id) {
          return { ...u, role: 'USER' };
        }
        return u;
      }),
    );
  };

  const kickUser = (user: UserType) => {
    socket.emit('kick', { channel: channelName, login: user.login });
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const banUser = (user: UserType) => {
    socket.emit('ban', { channel: channelName, login: user.login });
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const startGame = (user: UserType) => {
    const code = (Math.random() + 1).toString(36).substring(7);
    const message = `Come join me in a Pong game! ${window.location.origin}/game?code=${code}`;
    socket.emit('message', { channel: channelName, content: message });
  };

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
                  onClick={() => startGame(user)}
                >
                  <img className="w-6" src={game_icon} alt="close" />
                </button>
                {user.role === 'ADMIN' || user.role === 'OWNER' ? (
                  <button
                    className="rounded-full p-1 enabled:hover:bg-yellow-1 disabled:cursor-not-allowed"
                    title={'Demote user'}
                    disabled={!isAdmin || user.role === 'OWNER'}
                    onClick={() => demoteUser(user)}
                  >
                    <img className="w-6" src={demote_icon} alt="demote" />
                  </button>
                ) : (
                  <button
                    className="rounded-full p-1 enabled:hover:bg-yellow-1 disabled:cursor-not-allowed"
                    title={'Promote user to admin'}
                    disabled={!isAdmin}
                    onClick={() => promoteUser(user)}
                  >
                    <img className="w-6" src={promote_icon} alt="promote" />
                  </button>
                )}
                <button
                  className="rounded-full p-1 enabled:hover:bg-red disabled:cursor-not-allowed"
                  title={isAdmin ? 'Kick user' : "Can't kick user because you are not admin"}
                  disabled={!isAdmin}
                  onClick={() => kickUser(user)}
                >
                  <img className="w-6" src={kick_icon} alt="kick" />
                </button>
                <button
                  className="rounded-full p-1 enabled:hover:bg-red disabled:cursor-not-allowed"
                  title={isAdmin ? 'Ban user' : "Can't ban user because you are not admin"}
                  disabled={!isAdmin}
                  onClick={() => banUser(user)}
                >
                  <img className="w-6" src={ban_icon} alt="ban" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatInfos;
