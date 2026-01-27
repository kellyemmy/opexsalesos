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
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { UpdateCampaignDto } from './dtos/update-campaign.dto';
import { AuditService } from '@/audit/audit.service';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(
    private campaignsService: CampaignsService,
    private auditService: AuditService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateCampaignDto) {
    const userId = (req.user as any).sub;
    const campaign = await this.campaignsService.create(userId, dto);
    
    await this.auditService.log(userId, 'CREATE_CAMPAIGN', 'campaign', campaign.id, 'Created campaign');
    
    return campaign;
  }

  @Get()
  async findAll(@Req() req: Request, @Query('status') status?: string) {
    const userId = (req.user as any).sub;
    return this.campaignsService.findAll(userId, status);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).sub;
    return this.campaignsService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    const userId = (req.user as any).sub;
    const campaign = await this.campaignsService.update(id, userId, dto);
    
    await this.auditService.log(userId, 'UPDATE_CAMPAIGN', 'campaign', id, 'Updated campaign', { changes: dto });
    
    return campaign;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).sub;
    
    await this.auditService.log(userId, 'DELETE_CAMPAIGN', 'campaign', id, 'Deleted campaign');
    
    return this.campaignsService.delete(id, userId);
  }

  @Post(':id/leads/:leadId')
  async addLead(
    @Req() req: Request,
    @Param('id') campaignId: string,
    @Param('leadId') leadId: string,
  ) {
    const userId = (req.user as any).sub;
    const result = await this.campaignsService.addLeadToCampaign(campaignId, leadId, userId);
    
    await this.auditService.log(userId, 'ADD_LEAD_TO_CAMPAIGN', 'campaign_lead', `${campaignId}-${leadId}`, 'Added lead to campaign');
    
    return result;
  }

  @Delete(':id/leads/:leadId')
  async removeLead(
    @Req() req: Request,
    @Param('id') campaignId: string,
    @Param('leadId') leadId: string,
  ) {
    const userId = (req.user as any).sub;
    
    await this.auditService.log(userId, 'REMOVE_LEAD_FROM_CAMPAIGN', 'campaign_lead', `${campaignId}-${leadId}`, 'Removed lead from campaign');
    
    return this.campaignsService.removeLeadFromCampaign(campaignId, leadId, userId);
  }
}
