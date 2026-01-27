import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { EventsService } from '@/events/events.service';
import { MessagesService } from '@/messages/messages.service';
import { EventType } from '@prisma/client';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private messagesService: MessagesService,
  ) {}

  async handleSendgridWebhook(payload: any) {
    this.logger.log(`Received SendGrid webhook with ${payload.length || 1} events`);

    const events = Array.isArray(payload) ? payload : [payload];

    for (const event of events) {
      await this.processSendgridEvent(event);
    }

    return { processed: events.length };
  }

  private async processSendgridEvent(event: any) {
    const { email, event: eventType, smtp_id, timestamp, ...metadata } = event;

    let internalEventType: EventType;

    switch (eventType) {
      case 'sent':
        internalEventType = 'EMAIL_SENT';
        break;
      case 'delivered':
        internalEventType = 'EMAIL_DELIVERED';
        break;
      case 'open':
        internalEventType = 'EMAIL_OPENED';
        break;
      case 'click':
        internalEventType = 'EMAIL_CLICKED';
        break;
      case 'bounce':
        internalEventType = 'EMAIL_BOUNCED';
        break;
      case 'unsubscribe':
        internalEventType = 'EMAIL_UNSUBSCRIBED';
        break;
      default:
        this.logger.warn(`Unknown SendGrid event type: ${eventType}`);
        return;
    }

    // Find lead by email
    const lead = await this.prisma.lead.findFirst({
      where: { email },
    });

    if (!lead) {
      this.logger.warn(`Lead not found for email: ${email}`);
      return;
    }

    // Create event
    await this.eventsService.create(lead.id, {
      type: internalEventType,
      source: 'sendgrid',
      externalId: smtp_id,
      metadata,
      leadId: lead.id,
    });

    // Update message status if opened or clicked
    if (eventType === 'open') {
      const message = await this.prisma.message.findFirst({
        where: { externalId: smtp_id },
      });

      if (message) {
        await this.messagesService.updateStatus(message.id, message.userId, {
          status: 'OPENED',
        });
      }
    }

    this.logger.log(`Processed SendGrid event ${eventType} for ${email}`);
  }

  async handleTwilioWebhook(payload: any) {
    this.logger.log(`Received Twilio webhook`);

    const { MessageSid, From, MessageStatus, To } = payload;

    let internalEventType: EventType;

    switch (MessageStatus) {
      case 'sent':
        internalEventType = 'SMS_SENT';
        break;
      case 'delivered':
        internalEventType = 'SMS_DELIVERED';
        break;
      case 'failed':
        internalEventType = 'SMS_FAILED';
        break;
      default:
        this.logger.warn(`Unknown Twilio event type: ${MessageStatus}`);
        return;
      }

    // Find lead by phone
    const lead = await this.prisma.lead.findFirst({
      where: { phone: To },
    });

    if (!lead) {
      this.logger.warn(`Lead not found for phone: ${To}`);
      return;
    }

    // Create event
    await this.eventsService.create(lead.id, {
      type: internalEventType,
      source: 'twilio',
      externalId: MessageSid,
      metadata: { from: From, to: To },
      leadId: lead.id,
    });

    // Update message status
    const message = await this.prisma.message.findFirst({
      where: { externalId: MessageSid },
    });

    if (message) {
      await this.messagesService.updateStatus(message.id, message.userId, {
        status: 'DELIVERED',
      });
    }

    this.logger.log(`Processed Twilio event ${MessageStatus} for ${To}`);
  }

  async handleMailgunWebhook(payload: any) {
    this.logger.log(`Received Mailgun webhook`);

    const { 'event-data': eventData } = payload;

    if (!eventData) {
      this.logger.warn('No event-data in Mailgun webhook');
      return;
    }

    const { event: eventType, recipient, 'message-id': messageId, ...metadata } = eventData;

    let internalEventType: EventType;

    switch (eventType) {
      case 'sent':
        internalEventType = 'EMAIL_SENT';
        break;
      case 'delivered':
        internalEventType = 'EMAIL_DELIVERED';
        break;
      case 'opened':
        internalEventType = 'EMAIL_OPENED';
        break;
      case 'clicked':
        internalEventType = 'EMAIL_CLICKED';
        break;
      case 'bounced':
        internalEventType = 'EMAIL_BOUNCED';
        break;
      case 'unsubscribed':
        internalEventType = 'EMAIL_UNSUBSCRIBED';
        break;
      default:
        this.logger.warn(`Unknown Mailgun event type: ${eventType}`);
        return;
    }

    // Find lead by email
    const lead = await this.prisma.lead.findFirst({
      where: { email: recipient },
    });

    if (!lead) {
      this.logger.warn(`Lead not found for email: ${recipient}`);
      return;
    }

    // Create event
    await this.eventsService.create(lead.id, {
      type: internalEventType,
      source: 'mailgun',
      externalId: messageId,
      metadata,
      leadId: lead.id,
    });

    this.logger.log(`Processed Mailgun event ${eventType} for ${recipient}`);
  }
}
