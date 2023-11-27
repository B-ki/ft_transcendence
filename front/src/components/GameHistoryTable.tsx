import React, { FC, useState } from 'react';
import { UseQueryResult } from 'react-query';

import background from '@/assets/low-poly-grid-haikei.svg';
import { gameDto } from '@/dto/gameDto';
import { useApi } from '@/hooks/useApi';

import { Button } from './Button';

const PAGE_SIZE = 5; // Number of records per page

interface HistoryProps {
  login: string | undefined;
  games: gameDto[];
}

export const GameHistoryTable: FC<HistoryProps> = ({ login }) => {
  const [currentPage, setCurrentPage] = useState(1);
  let totalPages, startIndex, endIndex, visibleGameHistory, reverseArray, won;
  const {
    data: games,
    isLoading,
    isError,
  } = useApi().get(`get games of ${login}`, `game/all/${login}`) as UseQueryResult<gameDto[]>;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div
        className="border-separate rounded border bg-grey p-1 text-dark-1"
        style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}
      >
        {visibleGameHistory && games?.length ? (
          <React.Fragment>
            <table className=" m-2 table-auto">
              <thead>
                <tr className="text-white-2">
                  <th>Winner</th>
                  <th>Score</th>
                  <th>LOOOOOSER</th>
                </tr>
              </thead>
              <tbody>
                {visibleGameHistory.map((game, index) => (
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
                ))}
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
          </React.Fragment>
        ) : (
          <div className="flex items-center justify-center text-white-3">NO GAME PLAYED YET</div>
        )}
      </div>
    </>
  );
};
