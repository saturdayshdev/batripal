import { Injectable, Logger } from '@nestjs/common';
import { surgeries, type UserContext } from '@drizzle/schema';
import { DBService } from '@db/db.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class ChatRepository {
  private logger = new Logger(ChatRepository.name);

  constructor(private drizzle: DBService) {}

  async fetchUserContext(userId: string): Promise<UserContext | null> {
    try {
      const [userCtx] = await this.drizzle.db
        .select()
        .from(surgeries)
        .where(eq(surgeries.id, userId))
        .limit(1);

      if (!userCtx) {
        return null;
      }

      return userCtx;
    } catch (error) {
      this.logger.error('Error fetching user context', error);
      return null;
    }
  }

  async updateUserContext(
    userId: string,
    ctx: Partial<UserContext>,
  ): Promise<UserContext | null> {
    try {
      const [userCtx] = await this.drizzle.db
        .update(surgeries)
        .set(ctx)
        .where(eq(surgeries.id, userId))
        .returning();

      if (!userCtx) {
        return null;
      }

      return userCtx;
    } catch (error) {
      this.logger.error('Error updating user context', error);
      return null;
    }
  }
}
