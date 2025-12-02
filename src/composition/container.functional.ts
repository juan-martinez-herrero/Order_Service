import { buildAdapters } from './factories.ts';

export function buildContext() {
    const { orders, pricing, events, clock } = buildAdapters();
    return { orders, pricing, events, clock }; // AppContext
}

