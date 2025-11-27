// import {isHealthy} from './src/shared/health';
// const health = isHealthy();
// console.log(`Status: ${health.status}, Timestamp:${health.timestamp.toISOString()}`); 

import { buildServer } from "@infrastructure/http/server";

const port = Number(ProcessingInstruction.env.PORT ?? 3000);
buildServer().then(app => app.listen({port})) 
