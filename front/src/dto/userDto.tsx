import { ChannelType } from '@/components/chat/Chat';

export interface userDto {
  id: number;
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
  status: string;
}

export const dummyUserDto: userDto = {
  id: 621458,
  login: 'rmorel',
  first_name: 'romain',
  last_name: 'morel',
  email: 'lorem@ipsum.fr',
  imagePath: 'image',
  displayName: 'NoobMaster',
  description: '',
  intraImageURL: '',
  bannerPath: '',
  status: '',
};
