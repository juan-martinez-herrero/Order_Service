import { DomainEvent } from './DomainEvents.ts'

export class OrderCreated extends DomainEvent {
  constructor(orderSku: string) {
    super(orderSku)
  }
}