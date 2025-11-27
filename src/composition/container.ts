import {InMemoryOrderRepository } from "../infrastructure/persistence/InMemoryOrderRepository.ts";
import {CreateOrder } from "../application/use-cases/CreateOrderUseCase.ts";

const repo = new InMemoryOrderRepository();
export const createOrder = new CreateOrder(repo);
