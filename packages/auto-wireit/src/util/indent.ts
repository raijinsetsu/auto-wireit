export function indent(type: 'tab' | 'space', amount: number) {
    switch (type) {
        case 'tab':
            return '\t'.repeat(amount);
        case 'space':
            return ' '.repeat(amount);
    }
}
