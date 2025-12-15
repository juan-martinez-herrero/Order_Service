# Microservicio de Pedidos
- **Dominio**: Order, Price, SKU, Quantity, Domain Events.
- **Application**: Casos de uso CreateOrder, AddItemToOrder, puertos y DTOs.
- **Infrastructure**: repositorio InMemory, pricing estatico, event bus no-op.
- **HTTP**: endpoints minimos con Fastify.
- **Composition**: container.ts como composition root.
- **Tests**: dominio + aceptacion de casos de uso.
