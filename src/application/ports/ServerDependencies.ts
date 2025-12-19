import { CreateOrder } from '../use-cases/CreateOrderUseCase.ts'
import { AddItemToOrder } from '../use-cases/AddItemToOrderUseCase.ts'
import type { Logger } from './Logger.ts'

export interface ServerDependencies {
  createOrderUseCase: CreateOrder
  addItemToOrderUseCase: AddItemToOrder
  logger: Logger
}