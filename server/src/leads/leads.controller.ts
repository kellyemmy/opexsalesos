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
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateLeadDto } from './dtos/create-lead.dto';
import { UpdateLeadDto } from './dtos/update-lead.dto';
import { AuditService } from '@/audit/audit.service';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(
    private leadsService: LeadsService,
    private auditService: AuditService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateLeadDto) {
    const userId = (req.user as any).sub;
    const lead = await this.leadsService.create(userId, dto);
    
    await this.auditService.log(userId, 'CREATE_LEAD', 'lead', lead.id, 'Created lead');
    
    return lead;
  }

  @Get()
  async findAll(@Req() req: Request, @Query('status') status?: string) {
    const userId = (req.user as any).sub;
    return this.leadsService.findAll(userId, status);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).sub;
    return this.leadsService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    const userId = (req.user as any).sub;
    const lead = await this.leadsService.update(id, userId, dto);
    
    await this.auditService.log(userId, 'UPDATE_LEAD', 'lead', id, 'Updated lead', { changes: dto });
    
    return lead;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).sub;
    
    await this.auditService.log(userId, 'DELETE_LEAD', 'lead', id, 'Deleted lead');
    
    return this.leadsService.delete(id, userId);
  }
}
