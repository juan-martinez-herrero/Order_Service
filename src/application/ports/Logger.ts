export interface Logger {
  info(message: string, obj?: object): void
  error(message: string, obj?: object): void
  warn(message: string, obj?: object): void
  debug(message: string, obj?: object): void
  child(context: LoggerContext): Logger
}

export interface LoggerContext {
  requestId?: string
  userId?: string
  operation?: string
  [key: string]: any
}

/*
export interface Logger {
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
}
*/