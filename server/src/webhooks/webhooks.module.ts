import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { EventsModule } from '@/events/events.module';
import { MessagesModule } from '@/messages/messages.module';

@Module({
  imports: [PrismaModule, EventsModule, MessagesModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
