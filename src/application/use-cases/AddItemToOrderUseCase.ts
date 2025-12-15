import { SKU } from '../../domain/value-objects/sku.ts'
import { Quantity } from '../../domain/value-objects/quantity.ts'
import type { Result } from '../../shared/result.ts'
import { ok, fail } from '../../shared/result.ts'
import type { OrderRepository } from '../ports/OrderRepository.ts'
import type { PricingService } from '../ports/PricingService.ts'
import type { EventBus } from '../ports/EventBus.ts'
import type { AddItemToOrderDto } from '../dtos/AddItemToOrderDTO.ts'
import { AppError, ValidationError } from '../errors.ts'

export class AddItemToOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly pricingService: PricingService,
    private readonly eventBus: EventBus
  ) {}

  async execute(dto: AddItemToOrderDto): Promise<Result<void, AppError>> {
    try {
      const orderSku = new SKU(dto.orderSku)
      const productSku = new SKU(dto.productSku)
      const quantity = new Quantity(dto.quantity)

      const orderResult = await this.orderRepository.findById(orderSku)
      if (!orderResult.success) {
        return fail(orderResult.error)
      }
      
      const order = orderResult.data
      
      const priceResult = await this.pricingService.getPrice(productSku)
      if (!priceResult.success) {
        return fail(priceResult.error)
      }
      
      const unitPrice = priceResult.data

      order.addItem(productSku, quantity, unitPrice)
      
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
export function makeAddItemToOrderUseCase(ctx: AppContext) {
    return {
        async execute(input: AddItemToOrderInput): Promise<Result<AddItemToOrderOutput, ApplicationError>> {
            // igual, que antes, usando ctx.orders o ctx.pricing etc
        }
    }

====================================================================================================================


import type { Result, ok, Err, err, Ok } from '../../shared/result.ts';
import type { ApplicationError, ValidationError, NotFoundError, ConflictError } from '../../application/errors.ts';
import type { OrderRepository } from '../../application/ports/OrderRepository.ts';
import { PricingService } from '../../application/ports/PricingService.ts';
import { EventBus } from '../../application/ports/EventBus.ts';
import { Clock } from '../../application/ports/Clock.ts';
import type { AddItemToOrderInput, AddItemToOrderOutput } from '../dtos/AddItemToOrderDTO.ts';
import { Order } from '../../domain/entities/Order.ts';
import { SKU } from '../../domain/value-objects/SKU';
import { Quantity } from '../../domain/value-objects/Quantity.ts';
import { Price, CurrencyMismatch } from '../../domain/value-objects/Price.ts';

export class AddItemToOrder {
    constructor(
        private readonly repo: OrderRepository,
        private readonly pricing: PricingService,
        private readonly events: EventBus,
        private readonly clock: Clock
    ) {}
    // Validacion de entrada 
    async execute(input: AddItemToOrderInput): Promise<Result<AddItemToOrderOutput, ApplicationError>> {
        const v = this.validate(input);
        if (!v.ok) return v;
        // Cargar pedido
        const order = await this.repo.findById(input.orderId);
        if (!order) {
            const error: NotFoundError = {
                type: "NotFoundError", resource: "Order", id: input.orderId,};
            return err(error);
        }
        // Pedir precio actual e invocar a las reglas del agregado
        const sku = SKU.create(input.sku);
        const qty = Quantity.create(input.qty);
        const price = await this.pricing.getCurrentPrice(sku, input.currency);
        if (!price) {
            const error: ValidationError = {
                type: "validationError", message: "Unknown SKU", details: { sku: input.sku },};
            return Err(error);
        }
        
        try {
            order.addItem(sku, qty, price); // reglas del dominio
            // (Opcional) sellar timstamp en eventos con Clock si los eventos lo admiten
            await this.repo.save(order); // persistencia tras exito
            const events = order.pullDomainEvents();
            await this.events.publish(events); // notificar los cambios
            const total = order.total();
            return ok({
                orderId: order.id,
                total: {
                    amount: total.amount,
                    currency: total.currency,
                },
            });
        } catch (e) {
            if (e instanceof CurrencyMismatch) {
                const error: ConflictError = {
                    type: "ConflictError", message: "Currency mismatch when adding item to order",};
                return err(error);
            }

            // Otros DomainError -> ValidationError
            const error: ValidationError = {
                type: "ValidationError", message: (e as Error).message,};
            return err(error);
        }
    }   

    private validate(input: AddItemToOrderInput): Result<AddItemToOrderInput, ValidationError> {
        const errors: Record<string, string> = {};
        if (!input.orderId) errors.orderId = "Order ID is required";
        if (!/^[a-zA-Z0-9-]{3,30}$/.test(input.sku)) errors.sku = "Invalid SKU format";
        if (!Number.isInteger(input.qty) || input.qty <= 0) errors.qty = "Quantity must be a positive integer";
        if (!["EUR", "USD"].includes(input.currency)) errors.currency = "Unsupported currency";
        return Object.keys(errors).length ? err({type: "ValidationError", message: "Invalid input", details: errors}) : ok(input);
    }
}
*/
