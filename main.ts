import { buildServer } from "../../infrastructure/http/server.ts";
import { buildContainer } from "../composition/container.ts";

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


