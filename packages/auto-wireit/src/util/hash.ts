import { createHash } from 'node:crypto';

export function hash(value: string) {
    const h = createHash('sha512');
    h.update(value);
    return h.digest('base64');
}
