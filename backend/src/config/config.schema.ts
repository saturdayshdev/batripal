import { z } from 'zod';

export const ai = z.object({
  AI_API_KEY: z.string(),
  AI_STT_MODEL: z.string().default('gpt-4o-transcribe'),
  AI_STT_LANGUAGE: z.string().default('en'),
});

export const schema = z.object({
  APP_PORT: z.coerce.number().min(1000),
  ...ai.shape,
});

export type Env = z.infer<typeof schema>;
