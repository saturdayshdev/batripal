import { Injectable } from '@nestjs/common';
import { schema, Env } from './config.schema';

@Injectable()
export class ConfigService {
  public env: Env;

  constructor() {
    this.env = this.validate(process.env);
  }

  private validate(env: unknown): Env {
    return schema.parse(env);
  }
}
