import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { randomUUID } from 'crypto'
import { CreateOrder } from '../../../application/use-cases/CreateOrderUseCase.ts'
import { AddItemToOrder } from '../../../application/use-cases/AddItemToOrderUseCase.ts'
import type { CreateOrderDto } from '../../../application/dtos/CreateOrderDTO.ts'
import type { AddItemToOrderDto } from '../../../application/dtos/AddItemToOrderDTO.ts'
import { AppError } from '../../../application/errors.ts'
import type { Logger } from '../../../application/ports/Logger.ts'


interface CreateOrderRequest {
  orderSku: string
}

interface AddItemRequest {
  productSku: string
  quantity: number
}

interface AddItemParams {
  orderSku: string
}

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrder,
    private readonly addItemToOrderUseCase: AddItemToOrder,
    private readonly logger: Logger
  ) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.post('/orders', this.createOrder.bind(this))
    fastify.post('/orders/:orderSku/items', this.addItem.bind(this))
  }

  private async createOrder(
    request: FastifyRequest<{ Body: CreateOrderRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    const requestId = randomUUID()
    const logger = this.logger.child({ 
      requestId,
      operation: 'createOrder',
      method: request.method,
      url: request.url
    })
    
    logger.info('Creating order', { orderSku: request.body.orderSku })

    const dto: CreateOrderDto = {
      orderSku: request.body.orderSku
    }

    const result = await this.createOrderUseCase.execute(dto)

    if (!result.success) {
      const statusCode = this.mapErrorToStatusCode(result.error)
      
      logger.error('Order creation failed', {
        orderSku: request.body.orderSku,
        error: result.error.type,
        message: result.error.message,
        statusCode
      })

      reply.code(statusCode).send({
        error: result.error.type,
        message: result.error.message
      })
      return
    }

    logger.info('Order created successfully', { orderSku: request.body.orderSku })
    reply.code(201).send({ message: 'Order created successfully' })
  }

  private async addItem(
    request: FastifyRequest<{ 
      Params: AddItemParams
      Body: AddItemRequest 
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const requestId = randomUUID()
    const logger = this.logger.child({ 
      requestId,
      operation: 'addItem',
      method: request.method,
      url: request.url
    })
    
    logger.info('Adding item to order', {
      orderSku: request.params.orderSku,
      productSku: request.body.productSku,
      quantity: request.body.quantity
    })

    const dto: AddItemToOrderDto = {
      orderSku: request.params.orderSku,
      productSku: request.body.productSku,
      quantity: request.body.quantity
    }

    const result = await this.addItemToOrderUseCase.execute(dto)

    if (!result.success) {
      const statusCode = this.mapErrorToStatusCode(result.error)
      
      logger.error('Adding item to order failed', {
        orderSku: request.params.orderSku,
        productSku: request.body.productSku,
        quantity: request.body.quantity,
        error: result.error.type,
        message: result.error.message,
        statusCode
      })

      reply.code(statusCode).send({
        error: result.error.type,
        message: result.error.message
      })
      return
    }

    logger.info('Item added successfully', {
      orderSku: request.params.orderSku,
      productSku: request.body.productSku,
      quantity: request.body.quantity
    })

    reply.code(200).send({ message: 'Item added successfully' })
  }

  private mapErrorToStatusCode(error: AppError): number {
    switch (error.type) {
      case 'VALIDATION_ERROR':
        return 400
      case 'NOT_FOUND_ERROR':
        return 404
      case 'CONFLICT_ERROR':
        return 409
      case 'INFRA_ERROR':
        return 503
      default:
        return 500
    }
  }
}

  /*
  private async createOrder(
    request: FastifyRequest<{ Body: CreateOrderRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    const dto: CreateOrderDto = {
      orderSku: request.body.orderSku
    }

    const result = await this.createOrderUseCase.execute(dto)

    if (!result.success) {
      const statusCode = this.mapErrorToStatusCode(result.error)
      reply.code(statusCode).send({
        error: result.error.type,
        message: result.error.message
      })
      return
    }

    reply.code(201).send({ message: 'Order created successfully' })
  }

  private async addItem(
    request: FastifyRequest<{ 
      Params: AddItemParams
      Body: AddItemRequest 
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const dto: AddItemToOrderDto = {
      orderSku: request.params.orderSku,
      productSku: request.body.productSku,
      quantity: request.body.quantity
    }

    const result = await this.addItemToOrderUseCase.execute(dto)

    if (!result.success) {
      const statusCode = this.mapErrorToStatusCode(result.error)
      reply.code(statusCode).send({
        error: result.error.type,
        message: result.error.message
      })
      return
    }

    reply.code(200).send({ message: 'Item added successfully' })
  }

  private mapErrorToStatusCode(error: AppError): number {
    switch (error.type) {
      case 'VALIDATION_ERROR':
        return 400
      case 'NOT_FOUND_ERROR':
        return 404
      case 'CONFLICT_ERROR':
        return 409
      case 'INFRA_ERROR':
        return 503
      default:
        return 500
    }
  }
}
*/

/*
import type { FastifyRequest, FastifyReply } from "fastify";
import { AddItemToOrder } from "../../../application/use-cases/AddItemToOrderUseCase.ts";
import type { ApplicationError } from "../../../application/errors.ts";

export const makeOrdersController = (uc: AddItemToOrder) => ({
    addItem: async (req: FastifyRequest, reply: FastifyReply) => {
        const body = req.body as any;
        const res = await uc.execute({
            orderId: req.params["orderId"] as string,
            sku: body.sku, qty: body.qty, currency: body.currency
        });
        if (!res.ok) {
            const { status, body } = mapErrorToHttpResponse(res.error);
            return reply.status(status).send(body);
        }
        return reply.status(200).send(res.value);
    }
});

function mapErrorToHttp(error: ApplicationError): {
    switch(error.type) {
        case "validationError": return { status: 400, body: { message: error.message, details: error.details } };
        case "NotFoundError": return { status: 404, body: { message: error.message, details: error.details } };
        case "ConflictError": return { status: 409, body: { message: error.message, details: error.details } };
        case "InfrastructureError": return { status: 503, body: { message: error.message, details: error.details } };
        default: return { status: 500, body: { message: "Internal Server Error" } };
}
};

========================================================================================

import type { FastifyRequest, FastifyReply } from 'fastify';
import { createOrder } from '../../composition/container.ts'; // inyectado ya compuesto

export const OrdersController = {
    async create(req: FastifyRequest, res: FastifyReply) {
        const { orderId, customerId, } = req.body as any
        const out = await createOrder.execute({ orderId, customerId, })
        res.code(201).send(out)
    }
}; 

*/
