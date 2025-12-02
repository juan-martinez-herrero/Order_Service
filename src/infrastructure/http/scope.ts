import { request } from "http";
import type { AppContainer } from "../../composition/container.ts";

export type RequestScope = ReturnType<typeof makeRequestScope>;
export function makeRequestScope(c: AppContainer) {
    // Instancias por peticion (transient/scoped). Ej: un tracer con requestId
    return {
        ...c.useCases,
        requestId: crypto.randomUUID(),
    };
}

// En el controlador
const scope = makeRequestScope(container);
await scope.addItemToOrder.execute({ ... });



