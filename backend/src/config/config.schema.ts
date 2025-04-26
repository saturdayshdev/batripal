import { z } from 'zod';

export const schema = z.object({
  APP_PORT: z.coerce.number().min(1000),
  OPENAI_API_KEY: z.string(),
});

export type Env = z.infer<typeof schema>;
