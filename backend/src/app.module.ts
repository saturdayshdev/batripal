import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { AiModule } from '@ai/ai.module';
import { ChatModule } from '@chat/chat.module';

@Module({
  imports: [ConfigModule, AiModule, ChatModule],
})
export class AppModule {}
