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
  isConnected: boolean;
  bannerUrl: string;
  description: string;
  username: string;
}
