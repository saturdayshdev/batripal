import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@config/config.service';
import { AiSdk } from './ai.sdk';
import { AiPromptsService } from './ai.prompts';
import { AiPrompt } from './ai.enum';
import { createReadStream, type ReadStream } from 'fs';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';

@Injectable()
export class AiService {
  private logger = new Logger(AiService.name);

  constructor(
    private config: ConfigService,
    private aiSdk: AiSdk,
    private aiPrompts: AiPromptsService,
  ) {}

  private async createTempFile(data: Buffer): Promise<ReadStream> {
    const filePath = path.join(os.tmpdir(), `${Date.now()}.wav`);
    await fs.writeFile(filePath, data);
    return createReadStream(filePath);
  }

  async transcribe(buffer: Buffer): Promise<string | null> {
    try {
      const file = await this.createTempFile(buffer);
      const response = await this.aiSdk.client.audio.transcriptions.create({
        file: file,
        model: this.config.env.AI_STT_MODEL,
        language: this.config.env.AI_STT_LANGUAGE,
        prompt: this.aiPrompts.getPrompt(AiPrompt.STT),
        response_format: 'text',
      });

      await fs.unlink(file.path);
      this.logger.log('Transcription successful');

      return response;
    } catch (error) {
      this.logger.error('Error transcribing audio', error);
      return null;
    }
  }

  async createSpeech(text: string): Promise<Buffer | null> {
    try {
      const response = await this.aiSdk.client.audio.speech.create({
        model: this.config.env.AI_TTS_MODEL,
        voice: this.config.env.AI_TTS_VOICE,
        input: text,
        response_format: 'mp3',
      });

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      this.logger.error('Error creating speech', error);
      return null;
    }
  }
}
