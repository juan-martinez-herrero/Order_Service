import { Order } from '../../domain/entities/Order.ts'
import { SKU } from '../../domain/value-objects/sku.ts'
import type { Result } from '../../shared/result.ts'
import { ok, fail } from '../../shared/result.ts'
import type { OrderRepository } from '../../application/ports/OrderRepository.ts'
import type { EventBus } from '../../application/ports/EventBus.ts'
import type { CreateOrderDto } from '../dtos/CreateOrderDTO.ts'
import { AppError, ValidationError, ConflictError } from '../errors.ts'

export class CreateOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(dto: CreateOrderDto): Promise<Result<void, AppError>> {
    try {
      const orderSku = new SKU(dto.orderSku)
      
      const existingOrderResult = await this.orderRepository.findById(orderSku)
      if (existingOrderResult.success) {
        return fail(new ConflictError(`Order with SKU '${dto.orderSku}' already exists`))
      }
      
      if (existingOrderResult.error.type !== 'NOT_FOUND_ERROR') {
        return fail(existingOrderResult.error)
      }

      const order = new Order(orderSku)
      
      const saveResult = await this.orderRepository.save(order)
      if (!saveResult.success) {
        return fail(saveResult.error)
      }

      const publishResult = await this.eventBus.publish(order.events)
      if (!publishResult.success) {
        return fail(publishResult.error)
      }

      return ok(undefined)
    } catch (error) {
      if (error instanceof Error) {
        return fail(new ValidationError(error.message))
      }
      return fail(new ValidationError('Unknown validation error'))
    }
  }
}

/*
export type CreateOrderInput = { orderId: string; customerId: string };
export type CreateOrderOutput = { orderId: string };

export class CreateOrder {
    constructor(private readonly repo: OrderRepository) { }

    async execute({ orderId, customerId }: CreateOrderInput): Promise<CreateOrderOutput> {
        const exist = await this.repo.findById(orderId);
        if (exist) {
            throw new Error("Order already exists");
        }
        const order = new Order(orderId, customerId);
        await this.repo.save(order);
        return { orderId: order.id };
    }
}
*/
