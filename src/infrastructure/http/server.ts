import fastify from 'fastify';
import type { ServerDependencies } from '../../application/ports/ServerDependencies.ts'
import { OrderController } from './controllers/OrdersController.ts'

export async function buildServer(dependencies: ServerDependencies) {
  const server = fastify({ 
    logger: false 
  })

  // Presentation layer (Controllers)
  const orderController = new OrderController(
    dependencies.createOrderUseCase,
    dependencies.addItemToOrderUseCase,
    dependencies.logger
  )

  // Register routes
  await orderController.registerRoutes(server)

  // Health check endpoint
  server.get('/health', async () => {
    dependencies.logger.info('Health check requested')
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

=======================================================================================
  // Health check endpoint
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
    
*/