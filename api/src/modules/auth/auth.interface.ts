// custom types go here

export interface Test {
  id: number;
}

export interface JwtPayload {
  username: string;
}

export interface FortyTwoProfile {
  id: string;
  login: string;
  email: string;
  imageUrl: string;
  displayName: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}
