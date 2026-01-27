import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AuditService } from '@/audit/audit.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private aiService: AiService,
    private auditService: AuditService,
  ) {}

  @Post('write')
  async write(
    @Req() req: Request,
    @Body() input: {
      topic: string;
      leadName?: string;
      companyName?: string;
      tone?: string;
    },
  ) {
    const userId = (req.user as any).sub;
    const result = await this.aiService.write(userId, input);

    await this.auditService.log(userId, 'AI_WRITE', 'ai_request', `${userId}-write`, 'AI content generation', {
      topic: input.topic,
      tokens: result.tokens,
    });

    return result;
  }

  @Post('sequence')
  async sequence(
    @Req() req: Request,
    @Body() input: {
      leadName: string;
      companyName: string;
      productSummary: string;
      numberOfEmails?: number;
    },
  ) {
    const userId = (req.user as any).sub;
    const result = await this.aiService.sequence(userId, input);

    await this.auditService.log(userId, 'AI_SEQUENCE', 'ai_request', `${userId}-sequence`, 'AI sequence generation', {
      leadName: input.leadName,
      numberOfEmails: input.numberOfEmails || 5,
      tokens: result.tokens,
    });

    return result;
  }

  @Post('summarize')
  async summarize(
    @Req() req: Request,
    @Body() input: {
      leadName: string;
      interactions: string[];
    },
  ) {
    const userId = (req.user as any).sub;
    const result = await this.aiService.summarize(userId, input);

    await this.auditService.log(userId, 'AI_SUMMARIZE', 'ai_request', `${userId}-summarize`, 'AI interaction summarization', {
      leadName: input.leadName,
      interactionCount: input.interactions.length,
      tokens: result.tokens,
    });

    return result;
  }

  @Post('insights')
  async insights(
    @Req() req: Request,
    @Body() input: {
      leadName: string;
      company: string;
      history: string;
      currentStatus: string;
    },
  ) {
    const userId = (req.user as any).sub;
    const result = await this.aiService.insights(userId, input);

    await this.auditService.log(userId, 'AI_INSIGHTS', 'ai_request', `${userId}-insights`, 'AI lead insights generation', {
      leadName: input.leadName,
      tokens: result.tokens,
    });

    return result;
  }

  @Post('compliance')
  async compliance(
    @Req() req: Request,
    @Body() input: {
      content: string;
      jurisdiction?: string;
    },
  ) {
    const userId = (req.user as any).sub;
    const result = await this.aiService.compliance(userId, input);

    await this.auditService.log(userId, 'AI_COMPLIANCE', 'ai_request', `${userId}-compliance`, 'AI compliance review', {
      jurisdiction: input.jurisdiction || 'general',
      tokens: result.tokens,
    });

    return result;
  }
}
