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

  async createAssistant(
    name: string,
    description: string,
    instructions: string,
    model: string,
    tools: any[] = [],
    responseFormat?: { type: 'text' | 'json_object' },
  ): Promise<any> {
    try {
      const assistant = await this.client.beta.assistants.create({
        name,
        description,
        instructions,
        model,
        tools,
        ...(responseFormat && { response_format: responseFormat }),
      });
      
      this.logger.log(`Assistant ${name} created successfully`);
      return assistant;
    } catch (error) {
      this.logger.error(`Error creating assistant ${name}`, error);
      throw error;
    }
  }

  async createThread(): Promise<any> {
    try {
      const thread = await this.client.beta.threads.create();
      this.logger.log('Thread created successfully');
      return thread;
    } catch (error) {
      this.logger.error('Error creating thread', error);
      throw error;
    }
  }

  async addMessageToThread(threadId: string, content: string, role: 'user' | 'assistant' = 'user'): Promise<any> {
    try {
      const message = await this.client.beta.threads.messages.create(threadId, {
        role,
        content,
      });
      
      return message;
    } catch (error) {
      this.logger.error('Error adding message to thread', error);
      throw error;
    }
  }

  async runAssistant(threadId: string, assistantId: string): Promise<any> {
    try {
      const run = await this.client.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
      
      return run;
    } catch (error) {
      this.logger.error('Error running assistant', error);
      throw error;
    }
  }

  async getRunStatus(threadId: string, runId: string): Promise<any> {
    try {
      return await this.client.beta.threads.runs.retrieve(threadId, runId);
    } catch (error) {
      this.logger.error('Error getting run status', error);
      throw error;
    }
  }

  async getMessages(threadId: string): Promise<any> {
    try {
      return await this.client.beta.threads.messages.list(threadId);
    } catch (error) {
      this.logger.error('Error getting messages', error);
      throw error;
    }
  }
}
