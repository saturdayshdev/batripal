import { Module } from '@nestjs/common';
import { AiModule } from '@ai/ai.module';
import { DBModule } from '@db/db.module';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [AiModule, DBModule],
  providers: [ChatGateway, ChatRepository, ChatService],
})
export class ChatModule {}
