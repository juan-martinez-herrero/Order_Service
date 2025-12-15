# Microservicio de Pedidos
- **Dominio**: Order, Price, SKU, Quantity, Domain Events.
- **Application**: Casos de uso CreateOrder, AddItemToOrder, puertos y DTOs.
- **Infrastructure**: repositorio InMemory, pricing estatico, event bus no-op.
- **HTTP**: endpoints minimos con Fastify.
- **Composition**: container.ts como composition root.
- **Tests**: dominio + aceptacion de casos de uso.

## Estructura de Carpetas

'''
/src
    /domain
        /entities
        /value-objects
        /events
        /errors
    /application
        /use-cases
        /ports
        /dto
        /errors.ts
    /infrastructure
        /persistence
            /in-memory
        /http
            /controllers
        /messaging
    /composition
    /shared
/test

'''

## Comportamiento
- 'POST /orders' crea un pedido.
- 'POST /orders/:orderId/items' agrega una linea (SKU + qty) con precio actual.
- Devuelve el total del pedido.
