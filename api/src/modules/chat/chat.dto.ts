import { ChannelType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateChannelDTO {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @ValidateIf((o) => o.type === ChannelType.PROTECTED)
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}

export class UpdateChannelDTO extends CreateChannelDTO {}

export class CreateDmDTO {
  @IsNotEmpty()
  @MaxLength(8)
  login: string;
}

export class BlockUserDTO extends CreateDmDTO {}

export class JoinChannelDTO {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsOptional()
  @MaxLength(50)
  password: string;
}

export class LeaveChannelDTO {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
}

export class SendMessageDTO {
  @IsNotEmpty()
  @MaxLength(20)
  channel: string;

  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}

export class MessageHistoryDTO {
  @IsNotEmpty()
  @MaxLength(20)
  channel: string;

  @IsNotEmpty()
  @IsInt()
  @Max(100)
  @Min(1)
  limit: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset: number;
}

export class UserListInChannelDTO {
  @IsNotEmpty()
  @MaxLength(20)
  channel: string;
}
