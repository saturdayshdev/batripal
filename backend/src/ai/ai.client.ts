import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@config/config.service';
import OpenAI from 'openai';

@Injectable()
export class AiClient {
  private logger = new Logger(AiClient.name);
  public client: OpenAI;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.env.OPENAI_API_KEY,
    });

    this.logger.log('AI client initialized');
  }
}
