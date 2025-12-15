import { Order } from '../../domain/entities/Order.ts'
import { SKU } from '../../domain/value-objects/sku.ts'
import type { Result } from '../../shared/result.ts'
import { AppError } from '../errors.ts'

export interface OrderRepository {
    save(order: Order): Promise<Result<void, AppError>>
    findById(sku: SKU): Promise<Result<Order, AppError>>
}