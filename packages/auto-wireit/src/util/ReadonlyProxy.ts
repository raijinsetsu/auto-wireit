import { DeepReadonly } from './DeepReadonly.js';

export function ReadonlyProxy<T extends object>(target: T): DeepReadonly<T> {
    return new Proxy(target, {
        get(t, p) {
            return t[p as unknown as keyof T];
        },
        set(_t, p) {
            throw new Error(`Cannot set property "${p.toString()}" - object is readonly`);
        },
    }) as unknown as DeepReadonly<T>;
}
