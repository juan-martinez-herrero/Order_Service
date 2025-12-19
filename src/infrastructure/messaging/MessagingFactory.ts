import type { EventBus } from '../../application/ports/EventBus.ts'
import { OutboxEventBus } from './OutboxEventBus.ts'
import { NoopEventBus } from './NoopEventBus.js'
import { OutboxDispatcher } from './OutboxDispatcher.ts'
import { DatabaseFactory } from '../database/DatabaseFactory.ts'

export class MessagingFactory {
  static createEventBus(type: 'outbox' | 'noop' = 'outbox'): EventBus {
    if (type === 'noop') {
      return new NoopEventBus()
    }

    const pool = DatabaseFactory.createPool()
    return new OutboxEventBus(pool)
  }

  static createOutboxDispatcher(batchSize = 100, intervalMs = 5000): OutboxDispatcher {
    return new OutboxDispatcher(batchSize, intervalMs)
  }
}