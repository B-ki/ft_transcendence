export interface userDto {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  imageUrl: string;
  JWTtoken?: string;
  displayName: string;
  description: string;
  bannerUrl: string;
}

export const dummyUserDto: userDto = {
  login: 'rmorel',
  first_name: 'romain',
  last_name: 'morel',
  email: 'lorem@ipsum.fr',
  imageUrl: 'image',
  displayName: 'Noob Master',
  description: '',
};
