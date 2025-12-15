import { SKU } from '../../domain/value-objects/sku.ts'
import { Money } from '../../domain/value-objects/money.ts'
import type { Result } from '../../shared/result.ts'
import { AppError } from '../errors.ts'

export interface PricingService {
    getPrice(productSku: SKU): Promise<Result<Money, AppError>>
}