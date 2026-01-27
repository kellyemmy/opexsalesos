import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MessageChannel } from '@prisma/client';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(MessageChannel)
  channel: MessageChannel;

  @IsString()
  @IsOptional()
  campaignId?: string;

  @IsString()
  @IsOptional()
  subject?: string;
}
