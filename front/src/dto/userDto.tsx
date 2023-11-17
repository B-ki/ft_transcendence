export interface userDto {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  imagePath: string;
  JWTtoken?: string;
  displayName: string;
  description: string;
  bannerPath: string;
  intraImageURL: string;
}

export const dummyUserDto: userDto = {
  login: 'rmorel',
  first_name: 'romain',
  last_name: 'morel',
  email: 'lorem@ipsum.fr',
  imagePath: 'image',
  displayName: 'NoobMaster',
  description: '',
  intraImageURL: '',
  bannerPath: '',
};
