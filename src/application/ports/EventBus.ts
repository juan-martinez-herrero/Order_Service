import { DomainEvent } from '../../domain/events/domain-event.ts'
import type { Result } from '../../shared/result.ts'
import { AppError } from '../errors.ts'

export interface EventBus {
    publish(events: DomainEvent[]): Promise<Result<void, AppError>>
}