import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('sendgrid')
  async handleSendgridWebhook(@Body() payload: any) {
    return this.webhooksService.handleSendgridWebhook(payload);
  }

  @Post('twilio')
  async handleTwilioWebhook(@Body() payload: any) {
    return this.webhooksService.handleTwilioWebhook(payload);
  }

  @Post('mailgun')
  async handleMailgunWebhook(@Body() payload: any) {
    return this.webhooksService.handleMailgunWebhook(payload);
  }
}
