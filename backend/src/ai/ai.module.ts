import { Module } from '@nestjs/common';
import { AiSdk } from './ai.sdk';
import { AiPromptsService } from './ai.prompts';
import { AiService } from './ai.service';

@Module({
  providers: [AiSdk, AiPromptsService, AiService],
  exports: [AiService],
})
export class AiModule {}
