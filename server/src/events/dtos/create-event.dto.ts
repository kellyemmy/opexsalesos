import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator';
import { EventType } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  leadId: string;

  @IsEnum(EventType)
  type: EventType;

  @IsString()
  @IsOptional()
  campaignId?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  externalId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
