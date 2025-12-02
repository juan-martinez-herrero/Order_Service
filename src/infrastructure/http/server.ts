import Fastify from 'fastify';
import { makeOrdersController } from '../../infrastructure/http/controllers/OrdersController.ts';
import type { AppContainer } from '../../composition/container.ts';



export async function buildServer(c: AppContainer) {
    const app = Fastify();
    const ctrl = makeOrdersController(c.useCases.addItemToOrder, c.useCases.createOrder);
    app.post('/orders', ctrl.create);
    app.post('/orders/:orderId/items', ctrl.addItem);
    return app;
}