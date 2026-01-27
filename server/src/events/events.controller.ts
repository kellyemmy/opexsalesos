import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dtos/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto.leadId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request, @Query('leadId') leadId?: string) {
    const userId = (req.user as any).sub;
    
    if (leadId) {
      return this.eventsService.findAllForLead(leadId);
    }

    // Return all events for user's leads (implementation depends on schema)
    return [];
  }

  @Get('campaigns/:campaignId')
  @UseGuards(JwtAuthGuard)
  async findAllForCampaign(@Param('campaignId') campaignId: string) {
    return this.eventsService.findAllForCampaign(campaignId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}
