import { Module } from '@nestjs/common';
import { AiModule } from '@ai/ai.module';
import { DBModule } from '@db/db.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [AiModule, DBModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
