import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { UpdateCampaignDto } from './dtos/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        campaignLeads: true,
      },
    });
  }

  async findAll(userId: string, status?: string) {
    return this.prisma.campaign.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        campaignLeads: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.campaign.findFirst({
      where: { id, userId },
      include: {
        campaignLeads: {
          include: {
            lead: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateCampaignDto) {
    return this.prisma.campaign.updateMany({
      where: { id, userId },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.campaign.deleteMany({
      where: { id, userId },
    });
  }

  async addLeadToCampaign(campaignId: string, leadId: string, userId: string) {
    // Verify campaign belongs to user
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return this.prisma.campaignLead.create({
      data: {
        campaignId,
        leadId,
      },
    });
  }

  async removeLeadFromCampaign(campaignId: string, leadId: string, userId: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return this.prisma.campaignLead.deleteMany({
      where: { campaignId, leadId },
    });
  }
}
