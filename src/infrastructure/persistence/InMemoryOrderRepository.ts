import type { OrderRepository } from "../../application/ports/OrderRepository.ts";
import { Order } from "../../domain/entities/Order.ts";

export class InMemoryOrderRepository implements OrderRepository {
    private store = new Map<string, Order>()

    async save(order: Order) {
        this.store.set(order.id, order)
    };

    async findById(id: string) {
        return this.store.get(id) ?? null
    }
}
