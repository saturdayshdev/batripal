import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@config/config.service';
import OpenAI from 'openai';

@Injectable()
export class AiSdk {
  private logger = new Logger(AiSdk.name);
  public client: OpenAI;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.env.AI_API_KEY,
    });

    this.logger.log('AI SDK initialized');
  }
}
