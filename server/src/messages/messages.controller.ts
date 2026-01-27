import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageStatusDto } from './dtos/update-message-status.dto';
import { AuditService } from '@/audit/audit.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private auditService: AuditService,
  ) {}

  @Post('leads/:leadId')
  async createForLead(
    @Req() req: Request,
    @Param('leadId') leadId: string,
    @Body() dto: CreateMessageDto,
  ) {
    const userId = (req.user as any).sub;
    const message = await this.messagesService.create(userId, leadId, dto);
    
    await this.auditService.log(userId, 'CREATE_MESSAGE', 'message', message.id, 'Created message', { channel: dto.channel });
    
    return message;
  }

  @Get('leads/:leadId')
  async findAllForLead(@Req() req: Request, @Param('leadId') leadId: string) {
    const userId = (req.user as any).sub;
    return this.messagesService.findAllForLead(leadId, userId);
  }

  @Get('campaigns/:campaignId')
  async findAllForCampaign(@Req() req: Request, @Param('campaignId') campaignId: string) {
    const userId = (req.user as any).sub;
    return this.messagesService.findAllForCampaign(campaignId, userId);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).sub;
    return this.messagesService.findOne(id, userId);
  }

  @Put(':id/status')
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateMessageStatusDto,
  ) {
    const userId = (req.user as any).sub;
    const message = await this.messagesService.updateStatus(id, userId, dto);
    
    await this.auditService.log(userId, 'UPDATE_MESSAGE_STATUS', 'message', id, `Updated message status to ${dto.status}`);
    
    return message;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).sub;
    
    await this.auditService.log(userId, 'DELETE_MESSAGE', 'message', id, 'Deleted message');
    
    return this.messagesService.delete(id, userId);
  }
}
