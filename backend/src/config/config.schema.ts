import { z } from 'zod';

export const ai = z.object({
  AI_API_KEY: z.string(),
  AI_STT_MODEL: z.string().default('whisper-1'),
  AI_STT_LANGUAGE: z.string().default('en'),
  AI_TTS_MODEL: z.string().default('gpt-4o-mini-tts'),
  AI_TTS_VOICE: z.string().default('alloy'),
});

export const db = z.object({
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

export const schema = z.object({
  APP_PORT: z.coerce.number().min(1000),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ...ai.shape,
  ...db.shape,
});

export type Env = z.infer<typeof schema>;
