import React, { useState } from 'react';
import { Button } from './Button';
import background from '@/assets/low-poly-grid-haikei.svg';

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

export const GameHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(gameHistory.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const visibleGameHistory = gameHistory.slice(startIndex, endIndex);

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
              <th>Date</th>
              <th>Score</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {visibleGameHistory.map((game, index) => (
              <>
                {game.player1Score > game.player2Score ? (
                  <tr key={index} className="border bg-blue">
                    <td className="px-4 py-1">{game.date}</td>
                    <td className="px-5 py-1">
                      {game.player1Score} - {game.player2Score}
                    </td>
                    <td className="px-4 py-1">{game.duration}</td>
                  </tr>
                ) : game.player1Score < game.player2Score ? (
                  <tr key={index} className="border bg-red">
                    <td className="px-4 py-1">{game.date}</td>
                    <td className="px-5 py-1">
                      {game.player1Score} - {game.player2Score}
                    </td>
                    <td className="px-4 py-1">{game.duration}</td>
                  </tr>
                ) : (
                  <tr key={index} className="border bg-grey">
                    <td className="px-4 py-1">{game.date}</td>
                    <td className="px-5 py-1">
                      {game.player1Score} - {game.player2Score}
                    </td>
                    <td className="px-4 py-1">{game.duration}</td>
                  </tr>
                )}
              </>
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};
