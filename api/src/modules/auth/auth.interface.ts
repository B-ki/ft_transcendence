// custom types go here

export interface Test {
  id: number;
}

export interface JwtPayload {
  login: string;
}

export interface FortyTwoProfile {
  login: string;
  email: string;
  imageUrl: string;
  displayName: string;
  firstName: string;
  lastName: string;
}
