import React, { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { UseQueryResult } from 'react-query';
import { userDto } from '@/dto/userDto';
import { useState } from 'react';
import { Button } from './Button';

export const GameHistoryTable = () => {
  const [gameHistory, setGameHistory] = useState<userDto[]>([]); // Define gameHistory as a state variable

  const query = useApi().get('my games', `/game/all`) as UseQueryResult<userDto[]>;

  useEffect(() => {
    if (query.data) {
      setGameHistory(query.data);
      console.log(gameHistory);
    }
  }, []);

  return (
    <table className="table-auto border-separate rounded border bg-dark-3 text-dark-1">
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
            <td className="border px-4 py-2">{}</td>
            <td className="border px-4 py-2">{}</td>
            <td className="border px-4 py-2">{}</td>
            <td className="border px-4 py-2">{}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
