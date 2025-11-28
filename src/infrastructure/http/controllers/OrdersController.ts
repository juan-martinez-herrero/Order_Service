import type{ FastifyRequest, FastifyReply } from "fastify";
import { AddItemToOrder } from "../../../application/use-cases/AddItemToOrderUseCase.ts";
import type{ ApplicationError } from "../../../application/errors.ts";

export const makeOrdersController = (uc: AddItemToOrder) => ({
    addItem: async (req: FastifyRequest, reply: FastifyReply) => {
        const body = req.body as any;
        const res = await uc.execute({
            orderId: req.params["orderId"] as string,
            sku: body.sku, qty: body.qty, currency: body.currency});
            if (!res.ok) {
                const {status, body} = mapErrorToHttpResponse(res.error);
                return reply.status(status).send(body);
            }
            return reply.status(200).send(res.value);
    }
});

function mapErrorToHttp(error: ApplicationError): { 
    switch (error.type) {
        case "validationError": return { status: 400, body: { message: error.message, details: error.details } };
        case "NotFoundError": return { status: 404, body: { message: error.message, details: error.details } };
        case "ConflictError": return { status: 409, body: { message: error.message, details: error.details } };
        case "InfrastructureError": return { status: 503, body: { message: error.message, details: error.details} };
        default: return { status: 500, body: { message: "Internal Server Error" } };
    }
};


