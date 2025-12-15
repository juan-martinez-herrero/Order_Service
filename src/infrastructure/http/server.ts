import fastify from 'fastify';
import type { ServerDependencies } from '../../application/ports/ServerDependencies.ts'
import { OrderController } from './controllers/OrdersController.ts'

export async function buildServer(dependencies: ServerDependencies) {
  const server = fastify({ 
    logger: true 
  })

  // Presentation layer (Controllers)
  const orderController = new OrderController(
    dependencies.createOrderUseCase,
    dependencies.addItemToOrderUseCase
  )

  // Register routes
  await orderController.registerRoutes(server)

  // Health check endpoint
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  return server
}


/*
import { makeOrdersController } from '../../infrastructure/http/controllers/OrdersController.ts';
import type { AppContainer } from '../../composition/container.ts';

export async function buildServer(c: AppContainer) {
    const app = Fastify();
    const ctrl = makeOrdersController(c.useCases.addItemToOrder, c.useCases.createOrder);
    app.post('/orders', ctrl.create);
    app.post('/orders/:orderId/items', ctrl.addItem);
    return app;
}
    
*/