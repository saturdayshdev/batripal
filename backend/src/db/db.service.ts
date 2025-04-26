import { Injectable } from '@nestjs/common';
import * as schema from '@drizzle/schema';
import { ConfigService } from '@config/config.service';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class DBService {
  public db: NodePgDatabase<typeof schema>;

  constructor(private config: ConfigService) {
    this.db = drizzle({
      connection: {
        host: this.config.env.DB_HOST,
        port: this.config.env.DB_PORT,
        user: this.config.env.DB_USER,
        password: this.config.env.DB_PASSWORD,
        database: this.config.env.DB_NAME,
      },
      schema: schema,
    });
  }
}
