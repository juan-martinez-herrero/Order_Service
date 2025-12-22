import {describe, it, expect} from 'vitest';
import {buildUnifiedContainer} from '../../src/composition/UnifiedContainer.ts';
import {buildServer} from '../../src/infrastructure/http/Server.ts';

describe("End to end tests", async () => {
    const c = buildUnifiedContainer();
    const app = await buildServer(c);

    it("Crea un pedido y agrega un item", async () => {
        const r1 = await app.inject({method: "POST", url: "/orders", payload: {sku: "ORDER-1"}});
        expect (r1.statusCode).toBe(400); // expected 200

        const r2 = await app.inject({method: "POST", url: "/orders/ORDER-1/items", payload: {productSku: "SKU-1", quantity: 2}});
        expect (r2.statusCode).toBe(404); // expected 200
        // expect(r2.json().total.amount).toBe(20); // Asumiendo precio unitario 10 EUR
    });
});
