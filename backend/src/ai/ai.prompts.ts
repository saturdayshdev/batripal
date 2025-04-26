import { Injectable } from '@nestjs/common';
import { AiPrompt } from './ai.enum';

@Injectable()
export class AiPromptsService {
  private readonly prompts = {
    [AiPrompt.STT]: ``,
  };

  getPrompt(type: AiPrompt): string {
    const prompt = this.prompts[type];
    if (!prompt) {
      throw new Error(`Prompt not found for type: ${type}`);
    }

    return prompt;
  }
}
