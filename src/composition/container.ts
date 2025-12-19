import { InMemoryOrderRepository } from '../infrastructure/persistence/in-memory/InMemoryOrderRepository.ts'
import { StaticPricingService } from '../infrastructure/http/StaticPricingService.ts'
import { NoopEventBus } from '../infrastructure/messaging/NoopEventBus.ts'
import { PinoLogger } from '../infrastructure/logging/PinoLogger.ts'
import { CreateOrder } from '../application/use-cases/CreateOrderUseCase.ts'
import { AddItemToOrder } from '../application/use-cases/AddItemToOrderUseCase.ts'
import type { OrderRepository } from '../application/ports/OrderRepository.ts'
import type { PricingService } from '../application/ports/PricingService.ts'
import type { EventBus } from '../application/ports/EventBus.ts'
import type{ Logger } from '../application/ports/Logger.ts'
import type { ServerDependencies } from '../application/ports/ServerDependencies.ts'

export interface Dependencies extends ServerDependencies {
  // Ports
  orderRepository: OrderRepository
  pricingService: PricingService
  eventBus: EventBus
  logger: Logger
}

export function buildContainer(): Dependencies {
  // Infrastructure layer - Adapters
  const orderRepository = new InMemoryOrderRepository()
  const pricingService = new StaticPricingService()
  const eventBus = new NoopEventBus()
  const logger = new PinoLogger()

  // Application layer - Use Cases
  const createOrderUseCase = new CreateOrder(orderRepository, eventBus)
  const addItemToOrderUseCase = new AddItemToOrder(orderRepository, pricingService, eventBus)

  return {
    // Ports
    orderRepository,
    pricingService,
    eventBus,
    logger,
    
    // Use Cases
    createOrderUseCase,
    addItemToOrderUseCase
  }
}

/*
import { loadConfig } from "./config.ts";
import { InMemoryOrderRepository } from "../infrastructure/persistence/in-memory/InMemoryOrderRepository.ts";
import { PostgressOrderRepository } from "../infrastructure/persistence/postgres/PostgressOrderRepository.ts";
import { HttpPricingService } from "../infrastructure/http/HttpPricingService.ts";
import { OutboxEventBus } from "../infrastructure/messaging/OutboxEventBus.ts";
import { PinoLogger } from "../infrastructure/observability/PinoLogger.ts";
import { AddItemToOrder } from "../application/use-cases/AddItemToOrderUseCase.ts";
import { CreateOrder } from "../application/use-cases/CreateOrderUseCase.ts";
import { Pool } from "pg";

// Cambia aqui para in-memory o Postgres
export function buildContainer() {
    const cfg = loadConfig();
    const logger = new PinoLogger();

    const pool = cfg.USE_IN_MEMORY === "true"
        ? null
        : new Pool({ connectionString: cfg.DATABASE_URL });
    const orders = cfg.USE_IN_MEMORY === "true"
        ? new InMemoryOrderRepository()
        : new PostgressOrderRepository(pool!);
    const pricing = new HttpPricingService(cfg.PRICING_BASE_URL);
    const events = cfg.USE_IN_MEMORY === "true" ? { publish: async () => { } } : new OutboxEventBus(pool!);
    const clock = { now: () => new Date() };

    // Casos de uso
    const addItemToOrder = new AddItemToOrder(orders, pricing, events, clock);
    const createOrder = new CreateOrder(orders, events);

    return {
        config: cfg,
        logger, pool,
        ports: { orders, pricing, events, clock },
        useCases: { addItemToOrder, createOrder },
    };
}

export type AppContainer = ReturnType<typeof buildContainer>;

*/