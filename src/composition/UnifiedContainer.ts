import { config, useInMemoryDatabase, usePostgresDatabase } from './config.ts'
import { buildContainer } from './container.ts'
import { buildPostgresContainer, closeContainer as closePostgresContainer } from './PostgresContainer.ts'
import { StaticPricingService } from '../infrastructure/http/StaticPricingService.ts'
import { AddItemToOrder } from '../application/use-cases/AddItemToOrderUseCase.ts'
import { CreateOrder } from '../application/use-cases/CreateOrderUseCase.ts'
import { MessagingFactory } from '../infrastructure/messaging/MessagingFactory.ts'
import type { ServerDependencies } from '../application/ports/ServerDependencies.ts'
import { PinoLogger } from '../infrastructure/logging/PinoLogger.ts'
import { DatabaseFactory } from '../infrastructure/database/DatabaseFactory.ts'
import { PostgresOrderRepository } from '../infrastructure/persistence/postgres/PostgresOrderRepository.ts'

export interface UnifiedDependencies extends ServerDependencies {
  cleanup?: () => Promise<void>
}

export function buildUnifiedContainer(): UnifiedDependencies {
  const logger = new PinoLogger()
  
  if (useInMemoryDatabase()) {
    logger.info('Using in-memory database')
    const dependencies = buildContainer()
    
    return {
      ...dependencies,
      logger,
      cleanup: async () => {
        logger.info('Cleaning up in-memory dependencies')
        // No cleanup needed for in-memory
      }
    }
  }
  
  if (usePostgresDatabase()) {
    logger.info('Using PostgreSQL database')
    const postgresDependencies = buildPostgresContainer()
    
    // Create missing dependencies for server compatibility
    const pricingService = new StaticPricingService()
    const eventBus = MessagingFactory.createEventBus('outbox')
    
    // Create a shared PostgreSQL repository for non-UoW operations  
    const pool = DatabaseFactory.createPool()
    // For simplicity, we'll use the pool directly, but need to cast it
    const orderRepository = new PostgresOrderRepository(pool as any)
    
    // Create AddItemToOrder use case with actual repository
    const addItemToOrderUseCase = new AddItemToOrder(
      orderRepository,
      pricingService,
      eventBus
    )
    
    // Create adapter that extends CreateOrder for compatibility
    const createOrderUseCase = new CreateOrder(
      null as any, // Not used in UoW version
      eventBus
    )
    
    // Override execute method to use the UoW implementation
    createOrderUseCase.execute = postgresDependencies.createOrderUseCase.execute.bind(postgresDependencies.createOrderUseCase)
    
    return {
      createOrderUseCase,
      addItemToOrderUseCase,
      logger: postgresDependencies.logger,
      cleanup: async () => {
        logger.info('Cleaning up PostgreSQL dependencies')
        await closePostgresContainer()
      }
    }
  }
  
  throw new Error(`Unsupported database type: ${config.DATABASE_TYPE}`)
}