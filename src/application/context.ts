import type { OrderRepository } from "./ports/OrderRepository.ts";
import type { PricingService } from "./ports/PricingService.ts";
import type { EventBus } from "./ports/EventBus.ts";
import type { Clock } from "./ports/Clock.ts";

export type AppContainer = { orders: OrderRepository; pricing: PricingService; events: EventBus; clock: Clock };
