import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEventDto } from './dtos/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(leadId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        leadId,
      },
    });
  }

  async findAllForLead(leadId: string) {
    return this.prisma.event.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForCampaign(campaignId: string) {
    return this.prisma.event.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
      include: {
        lead: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async findByExternalId(externalId: string) {
    return this.prisma.event.findUnique({
      where: { externalId },
    });
  }
}
