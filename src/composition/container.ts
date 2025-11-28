import { InMemoryOrderRepository } from "../infrastructure/persistence/in-memory/InMemoryOrderRepository.ts";
import { PostgressOrderRepository } from "../infrastructure/persistence/postgres/PostgressOrderRepository.ts";
import { HttpPricingService } from "../infrastructure/http/HttpPricingService.ts";
import { OutboxEventBus } from "../infrastructure/messaging/OutboxEventBus.ts";
import { AddItemToOrder } from "../application/use-cases/AddItemToOrderUseCase.ts";
import { PinoLogger } from "../infrastructure/observability/PinoLogger.ts";
import { Pool } from "pg";

const env = process.env
const pool = new Pool({ connectionString: env.DATABASE_URL });

// Cambia aqui para in-memory o Postgres
const orders =
    env.USE_IN_MEMORY === "true" ? new InMemoryOrderRepository() : new PostgressOrderRepository(pool);

const pricing = new HttpPricingService(env.PRICING_BASE_URL ?? "http://localhost:4000");
const events = new OutboxEventBus(pool);
export const logger = new PinoLogger();

export const addItemToOrder = new AddItemToOrder(orders, pricing, events, { now: () => new Date() });
