import { Order } from "../../domain/entities/Order.ts";

export interface OrderRepository {
    save(order: Order): Promise<void>;
    findById(id: string): Promise<Order | null>;
}

