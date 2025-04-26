export type ChatMessage = {
  userId: string;
  audio: Buffer;
};

export type ChatResponse = {
  audioBase64: string;
  text: string;
};
