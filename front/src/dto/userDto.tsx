export interface userDto {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  imageUrl: string;
  bannerUrl: string;
  JWTtoken?: string;
  description?: string;
  displayName: string;
}

export const dummyUserDto: userDto = {
  login: 'rmorel',
  first_name: 'romain',
  last_name: 'morel',
  email: 'lorem@ipsum.fr',
  imageUrl: 'image',
  bannerUrl: '',
  displayName: 'Noob Master',
};
