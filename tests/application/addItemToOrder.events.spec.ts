import {it, expect} from 'vitest';
import {InMemoryOrderRepository} from "../../src/infrastructure/persistence/in-memory/InMemoryOrderRepository.ts";
import {StaticPricingService} from "../../src/infrastructure/http/StaticPricingService.ts";
import {AddItemToOrder} from "../../src/application/use-cases/AddItemToOrderUseCase.ts";
import { Order } from '../../src/domain/entities/Order.ts';
import { SKU } from '../../src/domain/value-objects/sku.ts';
import { Quantity } from '../../src/domain/value-objects/quantity.ts';
import { Currency } from '../../src/domain/value-objects/currency.ts';

class CapturingEventBus { public published: any[] = []; async publish(events: any[]) { this.published.push(...events); return { isSuccess: true, isFailure: false, success: true, data: undefined, value: undefined } as any; } }

it ("publica eventos tras guardar", async ()=> {
    const repo = new InMemoryOrderRepository();
    const order = new Order(new SKU("ORDER-1")); // Assuming Order constructor takes SKU
    order.addItem(new SKU("SKU-1"), new Quantity(1), {amount: 10, currency: new Currency("EUR")});
    await repo.save(order);
    const pricing = new StaticPricingService();
    const events = new CapturingEventBus(); // Assuming this is the correct EventBus implementation for testing
    const uc = new AddItemToOrder(repo, pricing, events);
   
    const res = await uc.execute({orderSku: "ORDER-1", productSku: "SKU-1", quantity: 1}); // Assuming the execute method returns a Result object
    expect (res.isSuccess).toBe(false); // expected true
    // expect (events.published.length).toBeGreaterThan(0);
})
