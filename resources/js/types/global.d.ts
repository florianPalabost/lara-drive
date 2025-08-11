import type { route as routeFn, type RouteName } from 'ziggy-js';

declare global {
    var route: (name: RouteName, params?: Record<string, string>, absolute?: boolean) => ReturnType<typeof routeFn>;
}

export {};
