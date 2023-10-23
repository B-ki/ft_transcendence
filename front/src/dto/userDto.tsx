export interface userDto {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  imageURL: string;
  JWTtoken?: string;
}

export const dummyUserDto: userDto = {
  login: 'rmorel',
  first_name: 'romain',
  last_name: 'morel',
  email: 'lorem@ipsum.fr',
  imageURL: 'image',
};
