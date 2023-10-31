import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @MaxLength(8)
  winnerLogin: string;

  @IsNotEmpty()
  @MaxLength(8)
  loserLogin: string;

  @IsNotEmpty()
  @IsNumber()
  winnerScore: number;

  @IsNotEmpty()
  @IsNumber()
  loserScore: number;
}
