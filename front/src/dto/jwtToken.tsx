export interface jwtToken {
  username: string;
  iat: number;
  exp: number;
}

export interface tokenDto {
  token: string;
}