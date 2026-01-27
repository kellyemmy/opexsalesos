import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async write(
    userId: string,
    input: {
      topic: string;
      leadName?: string;
      companyName?: string;
      tone?: string;
    },
  ) {
    const prompt = `Write a professional email for a sales engagement:
Lead Name: ${input.leadName || 'Prospect'}
Company: ${input.companyName || 'Company'}
Topic: ${input.topic}
Tone: ${input.tone || 'professional'}

Keep it concise (2-3 paragraphs) and compelling.`;

    return this.callOpenAI(userId, 'write', prompt);
  }

  async sequence(
    userId: string,
    input: {
      leadName: string;
      companyName: string;
      productSummary: string;
      numberOfEmails?: number;
    },
  ) {
    const numberOfEmails = input.numberOfEmails || 5;
    const prompt = `Create a ${numberOfEmails}-email follow-up sequence for sales outreach:
Lead: ${input.leadName}
Company: ${input.companyName}
Product/Service: ${input.productSummary}

For each email, provide:
1. Subject line
2. Body (2-3 paragraphs)
3. Call to action

Number each email clearly.`;

    return this.callOpenAI(userId, 'sequence', prompt);
  }

  async summarize(
    userId: string,
    input: {
      leadName: string;
      interactions: string[];
    },
  ) {
    const interactionText = input.interactions
      .map((i, idx) => `${idx + 1}. ${i}`)
      .join('\n');

    const prompt = `Summarize the following sales interactions with ${input.leadName}:

${interactionText}

Provide a brief summary (3-4 sentences) of key insights, objections, and next steps.`;

    return this.callOpenAI(userId, 'summarize', prompt);
  }

  async insights(
    userId: string,
    input: {
      leadName: string;
      company: string;
      history: string;
      currentStatus: string;
    },
  ) {
    const prompt = `Analyze this lead and suggest next steps:
Lead: ${input.leadName}
Company: ${input.company}
History: ${input.history}
Current Status: ${input.currentStatus}

Provide:
1. Engagement level assessment
2. Key pain points identified
3. Recommended next action (specific and actionable)
4. Optimal contact method and timing`;

    return this.callOpenAI(userId, 'insights', prompt);
  }

  async compliance(
    userId: string,
    input: {
      content: string;
      jurisdiction?: string;
    },
  ) {
    const jurisdiction = input.jurisdiction || 'general';
    const prompt = `Review this sales/marketing content for compliance issues (${jurisdiction} jurisdiction):

"${input.content}"

Identify:
1. Any compliance red flags
2. Required disclosures missing
3. Tone issues
4. Suggested improvements

If compliant, confirm that.`;

    return this.callOpenAI(userId, 'compliance', prompt);
  }

  private async callOpenAI(userId: string, action: string, prompt: string) {
    try {
      this.logger.log(`Calling OpenAI for action: ${action}`);

      const response = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL', 'gpt-4-turbo-preview'),
        messages: [
          {
            role: 'system',
            content: 'You are a sales engagement specialist helping with personalized outreach and compliance review.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      const tokenCount = response.usage?.total_tokens || 0;
      const estimatedCost = (tokenCount / 1000) * 0.01; // Approximate pricing

      // Log to database
      await this.prisma.aIUsage.create({
        data: {
          action,
          prompt,
          response: content,
          tokens: tokenCount,
          cost: estimatedCost,
          userId,
        },
      });

      this.logger.log(`OpenAI response generated (${tokenCount} tokens, $${estimatedCost.toFixed(4)})`);

      return {
        response: content,
        tokens: tokenCount,
        cost: estimatedCost,
      };
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }
}
