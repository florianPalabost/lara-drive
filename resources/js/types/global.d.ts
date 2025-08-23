import type { type RouteName, route as routeFn } from 'ziggy-js';

declare global {
    var route: (name: RouteName, params?: any, absolute?: boolean) => ReturnType<typeof routeFn>;
}

export {};
