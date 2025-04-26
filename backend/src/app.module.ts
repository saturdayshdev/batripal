import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { AiModule } from '@ai/ai.module';
import { MicService } from './mic.service';

@Module({
  imports: [ConfigModule, AiModule],
  providers: [MicService],
})
export class AppModule {}
