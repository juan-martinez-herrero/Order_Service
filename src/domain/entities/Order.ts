import { Price } from "../../domain/value-objects/Price.ts";
import { SKU } from "../../domain/value-objects/SKU.ts";
import { Quantity } from "../../domain/value-objects/Quantity.ts";

type OrderItem = Readonly<{ sku: SKU; quantity: Quantity; price: Price }>;

export class Order {
    private readonly items: OrderItem[] = [];
    private readonly domainEvents: DomainEvent[] = [];
    constructor(readonly id: OrderId, readonly customerId: CustomerId) { }

    static create(id: OrderId, customerId: CustomerId) {
        const order = new Order(id, customerId);
        order.record(new OrderCreated(order.id, order.customerId));
        return order;
    }

    addItem(sku: SKU, qty: Quantity, unit: Price) {
        if (this.items.length > 0) {
            const currency = this.items[0]?.quantity.currency;
            if (unit.currency !== currency) throw new CurrencyMismatch()
        }
        this.items.push(Object.freeze({ sku, quantity: qty, price: unit }));
        this.record(new ItemAdded(orderId: this.id, sku.value, qty.value, unit.amount));
    }

    total(): Price {
        if (this.items.lenght === 0) return Price.create(0, "EUR"); //CONVENCION, O LANZAR SI PROCEDE
        const currency = this.items[0].unit.currency;
        return this.items.reduce((acc, i) => acc.add(i.price.multiply(i.quantity.value)),
            Price.create(0, currency));
    }

    pullDomainEvents(): DomainEvent[] {
        const ev = [...this.domainEvents];
        (this as any).domainEvents = []; // vacia (truco controlado)
        return ev;
    }

    private record(e: DomainEvent) { this.domainEvents.push(e); }
}
