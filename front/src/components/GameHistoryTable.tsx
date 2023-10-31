import React from 'react';

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
];

export const GameHistoryTable = () => {
  return (
    <table className="table-auto border-separate rounded border text-dark-1">
      <thead>
        <tr>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Player 1 Score</th>
          <th className="px-4 py-2">Player 2 Score</th>
          <th className="px-4 py-2">Duration</th>
        </tr>
      </thead>
      <tbody>
        {gameHistory.map((game, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{game.date}</td>
            <td className="border px-4 py-2">{game.player1Score}</td>
            <td className="border px-4 py-2">{game.player2Score}</td>
            <td className="border px-4 py-2">{game.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
