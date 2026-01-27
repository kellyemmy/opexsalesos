import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    description: string,
    changes?: Record<string, any>,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action,
          resource,
          resourceId,
          description,
          userId,
          changes: changes || {},
        },
      });

      this.logger.log(`[${action}] ${resource}:${resourceId} - ${description}`);
    } catch (error) {
      this.logger.error(`Failed to log audit: ${error.message}`, error.stack);
    }
  }

  async getLogs(userId: string, limit: number = 100, offset: number = 0) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getResourceLogs(resourceId: string, limit: number = 50) {
    return this.prisma.auditLog.findMany({
      where: { resourceId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
