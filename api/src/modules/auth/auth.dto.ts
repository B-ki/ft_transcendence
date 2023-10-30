import { IsEmail, IsNotEmpty } from 'class-validator';

export class JwtPayload {
  login: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  login: string;

  @IsEmail()
  email: string;

  imageUrl: string;

  displayName: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  isConnected: boolean;

  bannerUrl: string;

  description: string;
}

export const DummyUserOne: CreateUserDto = {
  login: 'dummy1',
  email: 'dummy1@hotmail.fr',
  imageUrl: 'dumm1ImageUrl',
  displayName: 'dummy1',
  firstName: 'John',
  lastName: 'Rambo',
  isConnected: true,
  bannerUrl: 'dummy1bannerUrl',
  description: 'Cest pas ma guerre',
};

export const DummyUserTwo: CreateUserDto = {
  login: 'dummy2',
  email: 'dummy2@wanadoo.com',
  imageUrl: 'dumm2ImageUrl',
  displayName: 'dummy2',
  firstName: 'Alfred',
  lastName: 'Hitchcock',
  isConnected: true,
  bannerUrl: 'dummy2bannerUrl',
  description: 'Attention aux oiseaux',
};
