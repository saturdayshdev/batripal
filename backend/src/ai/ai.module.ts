import { Module } from '@nestjs/common';
import { AiClient } from './ai.client';

@Module({
  providers: [AiClient],
})
export class AiModule {}
