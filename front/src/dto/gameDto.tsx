export interface gameDto {
  winner: { id: number; date: string; login: string; displayName: string };
  loser: { id: number; date: string; login: string; displayName: string };
  winnerScore: number;
  loserScore: number;
}
