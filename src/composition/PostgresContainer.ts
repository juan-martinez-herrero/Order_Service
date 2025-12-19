import { StaticPricingService } from '../infrastructure/http/StaticPricingService.ts';
import { NoopEventBus } from '../infrastructure/messaging/NoopEventBus.ts';
import { PinoLogger } from '../infrastructure/logging/PinoLogger.ts';
import { CreateOrderWithUoW } from '../application/use-cases/CreateOrderWithUnitWork.ts';
import type { PricingService } from '../application/ports/PricingService.ts';
import type { EventBus } from '../application/ports/EventBus.ts';
import type { Logger } from '../application/ports/Logger.ts';
import type { UnitOfWork } from '../application/ports/UnitOfWorks.ts';
import { DatabaseFactory } from '../infrastructure/database/DatabaseFactory.ts';

export interface PostgresDependencies {
  // Ports
  unitOfWork: UnitOfWork;
  pricingService: PricingService;
  eventBus: EventBus;
  logger: Logger;
  
  // Use Cases
  createOrderUseCase: CreateOrderWithUoW;
}

export function buildPostgresContainer(): PostgresDependencies {
  // Infrastructure layer - Adapters
  const unitOfWork = DatabaseFactory.createUnitOfWork();
  const pricingService = new StaticPricingService();
  const eventBus = new NoopEventBus();
  const logger = new PinoLogger();

  // Application layer - Use Cases
  const createOrderUseCase = new CreateOrderWithUoW(unitOfWork, eventBus);

  return {
    // Ports
    unitOfWork,
    pricingService,
    eventBus,
    logger,
    
    // Use Cases
    createOrderUseCase,
  };
}

// Cleanup function for graceful shutdown
export async function closeContainer(): Promise<void> {
  await DatabaseFactory.closePool();
}
