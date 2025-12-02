import type { FastifyRequest, FastifyReply } from 'fastify';
import { createOrder } from '../../composition/container.ts'; // inyectado ya compuesto

export const OrdersController = {
    async create(req: FastifyRequest, res: FastifyReply) {
        const { orderId, customerId, } = req.body as any
        const out = await createOrder.execute({ orderId, customerId, })
        res.code(201).send(out)
    }
}; 