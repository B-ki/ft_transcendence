import React, { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { UseQueryResult } from 'react-query';
import { userDto } from '@/dto/userDto';
import { useState } from 'react';
import { Button } from './Button';

interface GameDto {
  winnerLogin: string;
  loserLogin: string;
  winnerScore: number;
  loserScore: number;
}

export const GameHistoryTable = () => {
  const { data, isLoading, isFetched } = useApi().get('my games', `/game/all`) as UseQueryResult<
    GameDto[]
  >;

  if (isLoading) return <div>Loading...</div>;
  console.log(data);

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
        {data?.map((game, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{}</td>
            <td className="border px-4 py-2">{game.winnerLogin}</td>
            <td className="border px-4 py-2">{game.loserLogin}</td>
            <td className="border px-4 py-2">{}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
