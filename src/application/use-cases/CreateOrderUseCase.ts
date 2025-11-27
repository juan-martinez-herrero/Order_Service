import type { OrderRepository } from "../../application/ports/OrderRepository.ts";
import { Order } from "../../domain/entities/Order.ts";

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

