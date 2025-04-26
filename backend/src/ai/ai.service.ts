import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@config/config.service';
import { AiSdk } from './ai.sdk';
import { AiPromptsService } from './ai.prompts';
import { AgentResponse, AgentType, AiPrompt } from './ai.enum';
import { createReadStream, type ReadStream } from 'fs';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';

interface Assistants {
  triage: any;
  dietetic: any;
  psychotherapy: any;
}

interface ConversationContext {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    specialist?: string;
  }>;
}

@Injectable()
export class AiService {
  private logger = new Logger(AiService.name);
  private assistants: Assistants | null = null;
  private conversationThread: any = null;
  private conversationContext: ConversationContext = { messages: [] };

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

  private async initializeAssistants(): Promise<void> {
    if (this.assistants) {
      return;
    }

    try {
      const triageAssistant = await this.aiSdk.createAssistant(
        'Triage Assistant',
        'Routes user queries to specialists',
        this.aiPrompts.getPrompt(AiPrompt.TRIAGE),
        'gpt-4.1-nano',
        [{ type: 'code_interpreter' }],
        { type: 'json_object' }
      );

      const dieteticAssistant = await this.aiSdk.createAssistant(
        'Dietetic Specialist',
        'Provides nutritional guidance for bariatric patients',
        this.aiPrompts.getPrompt(AiPrompt.DIETETIC),
        'gpt-4.1-nano',
        [{ type: 'code_interpreter' }]
      );

      const psychotherapyAssistant = await this.aiSdk.createAssistant(
        'Psychotherapy Specialist',
        'Provides psychological support for bariatric patients',
        this.aiPrompts.getPrompt(AiPrompt.PSYCHOTHERAPY),
        'gpt-4.1-nano',
        [{ type: 'code_interpreter' }]
      );

      this.assistants = {
        triage: triageAssistant,
        dietetic: dieteticAssistant,
        psychotherapy: psychotherapyAssistant
      };

      this.logger.log('All assistants initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize assistants', error);
      throw error;
    }
  }

  private async initializeConversation(): Promise<void> {
    if (this.conversationThread) {
      return;
    }

    try {
      await this.initializeAssistants();
      this.conversationThread = await this.aiSdk.createThread();
      this.logger.log('Conversation initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize conversation', error);
      throw error;
    }
  }

  private async parseAgentResponse(response: string): Promise<AgentResponse> {
    try {
      const cleanedResponse = response.replace(/```json\s*([\s\S]*?)\s*```/, '$1').trim();
      const parsed = JSON.parse(cleanedResponse);
      
      if (!parsed.agent || !parsed.content) {
        throw new Error('Invalid response structure');
      }
      
      if (!Object.values(AgentType).includes(parsed.agent)) {
        throw new Error('Invalid agent type');
      }
      
      return {
        agent: parsed.agent,
        content: parsed.content
      };
    } catch (error) {
      this.logger.error('Error parsing agent response', error);
      
      return {
        agent: AgentType.TRIAGE,
        content: 'I apologize, but there was an issue processing your request. Could you please rephrase your question?'
      };
    }
  }

  private async runAssistantWithPolling(assistantId: string, agentType: AgentType): Promise<string> {
    const run = await this.aiSdk.runAssistant(this.conversationThread.id, assistantId);
    
    let completed = false;
    while (!completed) {
      const runStatus = await this.aiSdk.getRunStatus(this.conversationThread.id, run.id);
      
      if (runStatus.status === 'completed') {
        completed = true;
      } else if (runStatus.status === 'failed') {
        throw new Error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const messages = await this.aiSdk.getMessages(this.conversationThread.id);
    const latestMessage = messages.data[0];
    
    if (!latestMessage || latestMessage.content[0]?.type !== 'text') {
      throw new Error('Invalid response format');
    }
    
    this.conversationContext.messages.push({
      role: 'assistant',
      content: latestMessage.content[0].text.value,
      specialist: agentType
    });
    
    return latestMessage.content[0].text.value;
  }

  private async processWithSpecialist(
    specialistType: AgentType.DIETETIC | AgentType.PSYCHOTHERAPY,
    userMessage: string,
  ): Promise<string> {
    const specialistAssistant = specialistType === AgentType.DIETETIC 
      ? this.assistants?.dietetic 
      : this.assistants?.psychotherapy;
    
    if (!specialistAssistant) {
      throw new Error(`${specialistType} assistant not initialized`);
    }

    const specialistResponse = await this.runAssistantWithPolling(
      specialistAssistant.id,
      specialistType
    );
    
    const context = `Previous user message: "${userMessage}"\nSpecialist (${specialistType}) response: "${specialistResponse}"`;
    await this.aiSdk.addMessageToThread(
      this.conversationThread.id,
      context,
      'assistant'
    );
    
    return specialistResponse;
  }

  async processUserInput(
    userInput: string,
    userContext?: string
  ): Promise<{ content: string; audioBuffer?: Buffer }> {
    try {
      await this.initializeConversation();
      
      if (userContext) {
        await this.aiSdk.addMessageToThread(
          this.conversationThread.id,
          userContext,
          'user'
        );
      }
      
      await this.aiSdk.addMessageToThread(
        this.conversationThread.id,
        userInput,
        'user'
      );
      
      this.conversationContext.messages.push({
        role: 'user',
        content: userInput
      });
      
      const triageResponse = await this.runAssistantWithPolling(
        this.assistants?.triage.id,
        AgentType.TRIAGE
      );
      
      const parsedResponse = await this.parseAgentResponse(triageResponse);
      
      let finalResponse: string;
      
      if (parsedResponse.agent === AgentType.DIETETIC || parsedResponse.agent === AgentType.PSYCHOTHERAPY) {
        finalResponse = await this.processWithSpecialist(
          parsedResponse.agent,
          userInput
        );
      } else {
        finalResponse = parsedResponse.content;
      }
      
      let audioBuffer: Buffer | null = null;
      const generateAudio = true; // You can make this configurable
      if (generateAudio) {
        audioBuffer = await this.createSpeech(finalResponse);
      }
      
      return {
        content: finalResponse,
        ...(audioBuffer && { audioBuffer })
      };
    } catch (error) {
      this.logger.error('Error processing user input', error);
      return {
        content: 'I apologize, but I encountered an issue processing your request. Please try again later.'
      };
    }
  }
}
