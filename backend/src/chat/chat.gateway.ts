import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { type ChatMessage } from './chat.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  private logger = new Logger(ChatGateway.name);
  constructor(private chatService: ChatService) {}

  private error(socket: Socket, message: string): void {
    this.logger.error(message);
    socket.emit('error', { message });
  }

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() message: ChatMessage,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const { userId, audio } = message;
    try {
      const response = await this.chatService.handleChatMessage(userId, audio);
      if (!response) {
        this.error(socket, 'Response generation failed');
        return;
      }

      socket.emit('response', {
        audioBase64: response.audioBase64,
        text: response.text,
      });
    } catch (error) {
      this.error(socket, error.message);
    }
  }
}
