import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageStatusDto } from './dtos/update-message-status.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, leadId: string, dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        ...dto,
        userId,
        leadId,
      },
    });
  }

  async findAllForLead(leadId: string, userId: string) {
    return this.prisma.message.findMany({
      where: {
        leadId,
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findAllForCampaign(campaignId: string, userId: string) {
    return this.prisma.message.findMany({
      where: {
        campaignId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        lead: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.message.findFirst({
      where: { id, userId },
    });
  }

  async updateStatus(id: string, userId: string, dto: UpdateMessageStatusDto) {
    return this.prisma.message.updateMany({
      where: { id, userId },
      data: {
        status: dto.status,
        ...(dto.status === 'OPENED' && { openedAt: new Date() }),
        ...(dto.status === 'CLICKED' && { clickedAt: new Date() }),
      },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.message.deleteMany({
      where: { id, userId },
    });
  }
}
