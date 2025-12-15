import { CreateOrder } from '../use-cases/CreateOrderUseCase.ts'
import { AddItemToOrder } from '../use-cases/AddItemToOrderUseCase.ts'

export interface ServerDependencies {
  createOrderUseCase: CreateOrder
  addItemToOrderUseCase: AddItemToOrder
}