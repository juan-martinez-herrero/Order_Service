import pino from 'pino';
import type { Logger } from '../../application/ports/Logger.ts';
import { debug, error, warn } from 'console';
export class PinoLogger implements Logger {
    private readonly log = pino()
    info(message: string, meta?: Record<string, unknown>): {this.log.info(meta ?? {}, message)}
    error(message: string, meta?: Record<string, unknown>): {this.log.error(meta ?? {}, message)}
    warn(message: string, meta?: Record<string, unknown>): {this.log.warn(meta ?? {}, message)}
}
    