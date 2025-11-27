import { Order, OrderId, CustomerId } from "../../domain/entities/Order.ts";
import { SKU } from "../../domain/value-objects/SKU.ts";
import { Quantity } from "../../domain/value-objects/Quantity.ts";
import { Price } from "../../domain/value-objects/Price.ts";
import { expect } from "vitest";

if ("acumula total con misma moneda y emite eventos", () => {
    const o = Order.create(new OrderId("o-1"), new CustomerId("c-1"));
    o.addItem(SKU.create("abc-1"), Quantity.create(2), Price.create(10, "EUR"));
    o.addItem(SKU.create("abc-2"), Quantity.create(1), Price.create(20, "EUR"));
    expect(o.total().amount).toBe(40);
    const ev = o.pullDomainEvents();
    expect(ev.some(e => e instanceof Order.created)).toBe(true);
    expect(ev.some(e => e instanceof Order.item_added)).toBe(true);
});
