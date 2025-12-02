import { DomainEvent } from "../../domain/events/DomainEvent.ts";

export interface EventBus {
    publish(events: DomainEvent[]): Promise<void>;
}   