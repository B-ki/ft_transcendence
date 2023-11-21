import React from 'react';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { FC } from 'react';
import { UseQueryResult } from 'react-query';
import background from '@/assets/low-poly-grid-haikei.svg';
import { Navigate, useNavigate } from 'react-router-dom';

interface Props {}

export const FriendList: FC<Props> = () => {
  const navigate = useNavigate();
  const {
    data: friendList,
    isLoading,
    isError,
  } = useApi().get('get friend list', 'user/friends/friendlist') as UseQueryResult<userDto[]>;

  return (
    <div>
      {friendList ? (
        friendList.map((friend, index) => (
          <React.Fragment key={index}>
            <div
              className="flex w-56 items-center justify-around gap-2 rounded border border-dark-1 px-4 py-2 text-xl text-white-3 hover:cursor-pointer"
              style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}
              onClick={() => navigate(`/user/${friend.login}`)}
            >
              <img
                className="w-16 rounded-full object-cover"
                src={friend.imagePath ? friend.imagePath : friend.intraImageURL}
                alt="Profile picture"
              ></img>
              <div>
                <div className="font-bold">
                  {friend.displayName ? friend.displayName : friend.login}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {friend.status === 'ONLINE' ? (
                    <React.Fragment>
                      <div>Online</div>
                      <div className="bg-green-1 flex h-3 w-3 rounded-full"></div>
                    </React.Fragment>
                  ) : friend.status === 'OFFLINE' ? (
                    <React.Fragment>
                      <div>Offline</div>
                      <div className="flex h-3 w-3 rounded-full bg-red"></div>
                    </React.Fragment>
                  ) : friend.status === 'INGAME' ? (
                    <React.Fragment>
                      <div>In Game</div>
                      <div className="flex h-3 w-3 rounded-full bg-blue"></div>
                    </React.Fragment>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};
