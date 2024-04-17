export function format<T>(spec: string, ...args: T[]) {
    let argN = 0;
    return spec.replaceAll(/(?<!%)%(?:[0-9]+|(?:s|j)[0-9]*)/gi, (token) => {
        let format: 'string' | 'json' = 'string';
        switch (token[1]) {
            case 'j':
                format = 'json';
            // fallthrough
            case 's':
                if (token.length > 2) {
                    argN = parseInt(token.substring(2));
                }
                break;
            default:
                argN = parseInt(token.substring(2));
        }

        if (argN >= args.length) {
            return token;
        }

        const val = args[argN];
        if (token.length === 2) {
            argN++;
        }
        switch (typeof val) {
            case 'bigint':
            case 'boolean':
            case 'number':
            case 'string':
            case 'symbol':
                break;
            case 'function':
                return '[Function]';
            case 'object':
                if (val === null) {
                    return 'null';
                }
                break;
            case 'undefined':
            default:
                return 'undefined';
        }

        switch (format) {
            case 'json':
                return JSON.stringify(val);
            case 'string':
                return val.toString();
        }
    });
}
