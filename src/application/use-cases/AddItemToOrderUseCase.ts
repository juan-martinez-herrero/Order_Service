export function makeAddItemToOrderUseCase(ctx: AppContext) {
    return {
        async execute(input: AddItemToOrderInput): Promise<Result<AddItemToOrderOutput, ApplicationError>> {
            // igual, que antes, usando ctx.orders o ctx.pricing etc
        }
    }

/*
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
