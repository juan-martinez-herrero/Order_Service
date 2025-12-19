import { DomainEvent } from '../../domain/events/DomainEvents.ts'
import type { Result } from '../../shared/result.ts'
import { AppError } from '../errors.ts'

export interface EventBus {
    publish(events: DomainEvent[]): Promise<Result<void, AppError>>
}