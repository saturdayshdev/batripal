import { Injectable, Logger } from '@nestjs/common';
import { type UserContext } from '@drizzle/schema';
import { AiService } from '@ai/ai.service';
import { type ChatResponse } from './chat.type';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  private logger = new Logger(ChatService.name);
  constructor(
    private repository: ChatRepository,
    private aiService: AiService,
  ) {}

  private async getUserContext(userId: string): Promise<UserContext> {
    const userCtx = await this.repository.fetchUserContext(userId);
    if (!userCtx) {
      throw new Error('User context not found');
    }

    return userCtx;
  }

  private async updateUserContext(userId: string, ctx: Partial<UserContext>) {
    const userCtx = await this.repository.updateUserContext(userId, ctx);
    if (!userCtx) {
      throw new Error('Failed to update user context');
    }

    return userCtx;
  }

  private async generateResponse(transcript: string): Promise<string> {
    return transcript; // Placeholder for actual response generation logic
  }

  async handleChatMessage(
    userId: string,
    audio: Buffer,
  ): Promise<ChatResponse> {
    const userCtx = await this.getUserContext(userId);
    if (!userCtx) {
      throw new Error('User context not found');
    }

    const transcript = await this.aiService.transcribe(audio);
    if (!transcript) {
      throw new Error('Transcription failed');
    }

    const response = await this.generateResponse(transcript);
    if (!response) {
      throw new Error('Response generation failed');
    }

    const speech = await this.aiService.createSpeech(response);
    if (!speech) {
      throw new Error('Speech generation failed');
    }

    this.logger.debug({
      audioBase64: speech.toString('base64'),
      text: response,
    });

    return {
      audioBase64: speech.toString('base64'),
      text: response,
    };
  }
}
