import React, { FC, useState } from 'react';

import background from '@/assets/low-poly-grid-haikei.svg';

import { Button } from './Button';
import { useApi } from '@/hooks/useApi';
import { UseQueryResult } from 'react-query';
import { gameDto } from '@/dto/gameDto';
import { userDto } from '@/dto/userDto';

const PAGE_SIZE = 5; // Number of records per page

const headParams = [{ title: 'You' }, { title: 'Score' }, { title: 'Opponent' }];

const gameHistory = [
  {
    date: '2023-10-25 15:30',
    player1Score: 3,
    player2Score: 2,
    duration: '5 minutes',
  },
  {
    date: '2023-10-26 16:45',
    player1Score: 2,
    player2Score: 2,
    duration: '6 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 5,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 5,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 5,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 5,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 5,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 1,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 3,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
  {
    date: '2023-10-27 18:15',
    player1Score: 2,
    player2Score: 3,
    duration: '8 minutes',
  },
];

interface HistoryProps {
  login: string | undefined;
}

export const GameHistoryTable: FC<HistoryProps> = ({ login }) => {
  const [currentPage, setCurrentPage] = useState(1);
  let totalPages, startIndex, endIndex, visibleGameHistory, reverseArray;
  const {
    data: games,
    isLoading,
    isError,
  } = useApi().get('get games', 'game/all') as UseQueryResult<gameDto[]>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  if (games) {
    totalPages = Math.ceil(games.length / PAGE_SIZE);
    startIndex = (currentPage - 1) * PAGE_SIZE;
    endIndex = startIndex + PAGE_SIZE;

    reverseArray = [...games].reverse();
    visibleGameHistory = reverseArray.slice(startIndex, endIndex);
  }
  if (games) console.log(games);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div
        className="border-separate rounded border bg-grey p-1 text-dark-1"
        style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}
      >
        <table className=" m-2 table-auto">
          <thead>
            <tr className="text-white-2">
              <th>Winner</th>
              <th>Score</th>
              <th>LOOOOOSER</th>
            </tr>
          </thead>
          <tbody>
            {visibleGameHistory ? (
              visibleGameHistory.map((game, index) => (
                <React.Fragment key={index}>
                  {game.winner.login === login ? (
                    <tr className="border bg-blue">
                      <td className="px-4 py-1">{game.winner.displayName}</td>
                      <td className="px-5 py-1">
                        {game.winnerScore} - {game.loserScore}
                      </td>
                      <td className="px-4 py-1">{game.loser.displayName}</td>
                    </tr>
                  ) : (
                    <tr className="border bg-red">
                      <td className="px-4 py-1">{game.winner.displayName}</td>
                      <td className="px-5 py-1">
                        {game.winnerScore} - {game.loserScore}
                      </td>
                      <td className="px-4 py-1">{game.loser.displayName}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div></div>
            )}
          </tbody>
        </table>

        <div className="flex w-full justify-center gap-2 p-1">
          <Button
            size="xsmall"
            type="primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-white-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            size="xsmall"
            type="primary"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};
