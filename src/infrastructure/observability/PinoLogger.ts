import pino from 'pino';
import type { Logger } from '../../application/ports/Logger.ts';
import { debug, error, warn } from 'console';
import type { meta } from 'node_modules/zod/v4/classic/external.d.cts';
export class PinoLogger implements Logger {
    private readonly log = pino()
    info(message: string, meta?: Record<string, unknown>): {this.log.info(meta ?? {}, message)}
    error(message: string, meta ?: Record<string, unknown>): { this.log.error(meta ?? {}, message) }
    warn(message: string, meta ?: Record<string, unknown>): { this.log.warn(meta ?? {}, message) }
}

