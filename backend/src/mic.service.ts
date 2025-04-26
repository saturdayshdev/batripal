import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Readable } from 'stream';
import mic = require('mic');

@Injectable()
export class MicService implements OnModuleDestroy {
  private micStream: Readable | null = null;
  private micInstance: any = null;

  getMicStream(): Readable | null {
    if (this.micStream) return this.micStream;

    this.micInstance = mic({
      rate: '24000',
      channels: '1',
      bitwidth: '16',
      encoding: 'signed-integer',
      endian: 'little',
      fileType: 'raw',
      debug: false,
    });

    this.micStream = this.micInstance.getAudioStream();

    this.micStream?.on('startComplete', () => {
      console.log('🎙️ Mic recording started');
    });

    this.micStream?.on('error', (err) => {
      console.error('🎤 Mic stream error:', err);
    });

    this.micStream?.on('data', (data) => {
      //
    });

    this.micInstance.start();

    return this.micStream;
  }

  stop(): void {
    if (this.micInstance) {
      this.micInstance.stop();
      console.log('🛑 Mic recording stopped');
    }
  }

  async onModuleInit() {
    this.getMicStream();
  }

  onModuleDestroy() {
    this.stop();
  }
}
