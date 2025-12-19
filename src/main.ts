import { buildServer } from './infrastructure/http/server.ts'
import { buildUnifiedContainer } from './composition/UnifiedContainer.ts'
import { config } from './composition/config.ts'
import type { FastifyInstance } from 'fastify'

let server: FastifyInstance | null = null
let dependencies: Awaited<ReturnType<typeof buildUnifiedContainer>> | null = null

async function main() {
  try {
    console.log(`🚀 Starting application in ${config.NODE_ENV} mode`)
    console.log(`📊 Database type: ${config.DATABASE_TYPE}`)
    
    // Composition Root - Dependency Injection
    dependencies = buildUnifiedContainer()
    dependencies.logger.info('Dependencies initialized')
    
    // Build server with injected dependencies
    server = await buildServer(dependencies)
    dependencies.logger.info('Server built successfully')
    
    const host = process.env.HOST || '0.0.0.0'
    const port = config.PORT
    
    await server.listen({ host, port })
    
    dependencies.logger.info('Server started successfully', { host, port })
    console.log(`🚀 Server running at http://${host}:${port}`)
    console.log(`📋 Health check: http://${host}:${port}/health`)
    console.log(`📦 Orders API: http://${host}:${port}/orders`)
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    if (dependencies?.logger) {
      dependencies.logger.error('Server startup failed', { error: (error as Error).message })
    }
    await cleanup()
    process.exit(1)
  }
}

async function cleanup() {
  console.log('🧹 Starting cleanup process...')
  
  try {
    // Close server
    if (server) {
      console.log('📡 Closing HTTP server...')
      await server.close()
      console.log('✅ HTTP server closed')
    }
    
    // Cleanup dependencies (database connections, etc.)
    if (dependencies?.cleanup) {
      console.log('🗃️ Cleaning up dependencies...')
      await dependencies.cleanup()
      console.log('✅ Dependencies cleaned up')
    }
    
    console.log('✅ Cleanup completed successfully')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    if (dependencies?.logger) {
      dependencies.logger.error('Cleanup failed', { error: (error as Error).message })
    }
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...')
  if (dependencies?.logger) {
    dependencies.logger.info('SIGTERM received, initiating graceful shutdown')
  }
  await cleanup()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...')
  if (dependencies?.logger) {
    dependencies.logger.info('SIGINT received, initiating graceful shutdown')
  }
  await cleanup()
  process.exit(0)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Promise Rejection:', reason)
  if (dependencies?.logger) {
    dependencies.logger.error('Unhandled promise rejection', { 
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined
    })
  }
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error)
  if (dependencies?.logger) {
    dependencies.logger.error('Uncaught exception', { 
      error: error.message,
      stack: error.stack
    })
  }
  cleanup().finally(() => {
    process.exit(1)
  })
})

main().catch(async (error) => {
  console.error('💥 Unhandled error in main:', error)
  if (dependencies?.logger) {
    dependencies.logger.error('Main function failed', { error: error.message })
  }
  await cleanup()
  process.exit(1)
})

/*
import { buildServer } from "./infrastructure/http/server.ts";
import { buildContainer } from "./composition/container.ts";

async function main() {
  try {
    // Composition Root - Dependency Injection
    const dependencies = buildContainer()
    
    // Build server with injected dependencies
    const server = await buildServer(dependencies)
    
    const host = process.env.HOST || '0.0.0.0'
    const port = parseInt(process.env.PORT || '3000', 10)
    
    await server.listen({ host, port })
    
    console.log(`🚀 Server running at http://${host}:${port}`)
    console.log(`📋 Health check: http://${host}:${port}/health`)
    console.log(`📦 Orders API: http://${host}:${port}/orders`)
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  process.exit(0)
})

main().catch((error) => {
  console.error('💥 Unhandled error in main:', error)
  process.exit(1)
})
*/
/*
async function main() {
    const c = buildContainer();
    const app = await buildServer(c); //inyectamos container

    const port = Number(c.cfg.PORT)
    const address = await app.listen({ port });
    c.ports?.events && c.cfg.USE_IN_MEMORY === "false" && console.log(`Outbox ready`);

    const shutdown = async (signal: string) => {
        c.logger.info(`Received ${signal}, shutting down...`);
        await app.close();
        if (c.pool) await c.pool.end();
        process.exit(0);
    }

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
*/

