import type { EventBus } from "../../application/ports/EventBus.ts";
import { DomainEvent } from "../../domain/events/DomainEvent.ts";
import { randomUUID } from "crypto"

type Queryable = { query: (q: string, params?: any[]) => Promise<unknown> };

export class OutboxEventBus implements EventBus {
    constructor(private readonly db: Queryable) { }
    async publish(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.db.query(
                `INSERT INTO outbox_events (id, type, occurred_at, payload, published_at) VALUES ($1, $2, $3, $4, NULL)`,
                [
                    randomUUID(),
                    event.type, JSON.stringify(event.payload),
                    event.occurredAt.toISOString()]
            );
        }
    }
}