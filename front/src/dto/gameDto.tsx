export interface gameDto {
  id: number;
  winnerId: number;
  looserId: number;
  winner: { id: number; login: string; displayName: string };
  loser: { id: number; login: string; displayName: string };
  winnerScore: number;
  loserScore: number;
}
