import { DomainEvent } from '../../domain/events/domain-event.ts'
import type { Result } from '../../shared/result.ts'
import { ok } from '../../shared/result.ts'
import type { EventBus } from '../../application/ports/EventBus.ts'
import { AppError } from '../../application/errors.ts'

export class NoopEventBus implements EventBus {
  async publish(_events: DomainEvent[]): Promise<Result<void, AppError>> {
    return ok(undefined)
  }
}