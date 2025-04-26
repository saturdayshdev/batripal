import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { AiModule } from '@ai/ai.module';

@Module({
  imports: [ConfigModule, AiModule],
})
export class AppModule {}
