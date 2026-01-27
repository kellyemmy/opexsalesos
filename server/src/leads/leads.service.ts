import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLeadDto } from './dtos/create-lead.dto';
import { UpdateLeadDto } from './dtos/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string, status?: string) {
    return this.prisma.lead.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        campaigns: true,
        messages: true,
        events: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.lead.findFirst({
      where: { id, userId },
      include: {
        campaigns: true,
        messages: true,
        events: true,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateLeadDto) {
    return this.prisma.lead.updateMany({
      where: { id, userId },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.lead.deleteMany({
      where: { id, userId },
    });
  }
}
