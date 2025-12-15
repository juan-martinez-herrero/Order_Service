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

