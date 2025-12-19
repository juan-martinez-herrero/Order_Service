import { Pool } from 'pg';
import type { UnitOfWork, Repositories } from '../../../application/ports/UnitOfWorks.ts';
import { PostgresOrderRepository } from './PostgresOrderRepository.ts';
import type { Result } from '../../../shared/result.ts';
import { ok, fail } from '../../../shared/result.ts';
import { AppError, InfraError } from '../../../application/errors.ts';

export class PgUnitOfWork implements UnitOfWork {
  constructor(private readonly pool: Pool) {}

  async run<T>(fn: (repos: Repositories) => Promise<T>): Promise<Result<T, AppError>> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create repositories that share the same connection/transaction
      const repositories: Repositories = {
        orderRepository: new PostgresOrderRepository(client),
      };
      
      // Execute the business logic
      const result = await fn(repositories);
      
      await client.query('COMMIT');
      
      return ok(result);
    } catch (error) {
      await client.query('ROLLBACK');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown transaction error';
      return fail(new InfraError(`Transaction failed: ${errorMessage}`));
    } finally {
      client.release();
    }
  }
}
