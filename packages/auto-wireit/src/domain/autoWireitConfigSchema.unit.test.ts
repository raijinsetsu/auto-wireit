import { AutoWireitConfig } from './AutoWireitConfig.js';
import { autoWireitConfigSchema } from './autoWireitConfigSchema.js';

const plugins: AutoWireitConfig['plugins'] = [
    {
        name: 'plugin1',
        run: async () => {},
    },
    {
        name: 'plugin2',
        run: async () => {},
    },
];

describe('autoWireitConfigSchema unit tets', () => {
    test('When the document is valid then validation does not fail', async () => {
        // Act
        await expect(autoWireitConfigSchema.parseAsync({ extends: 'base', plugins })).resolves.not.toThrow();
    });

    test('When the plugins property is missing then validation fails', async () => {
        // Act
        await expect(autoWireitConfigSchema.parseAsync({})).rejects.toThrow();
    });

    test('When the plugins property is an empty array then validation fails', async () => {
        // Act
        await expect(autoWireitConfigSchema.parseAsync({ plugins: [] })).rejects.toThrow();
    });

    test('When the extends property is not a string then validation fails', async () => {
        // Act
        await expect(autoWireitConfigSchema.parseAsync({ extends: 1, plugins })).rejects.toThrow();
    });

    test('When the extends properyt is an array of non-strings then validation fails', async () => {
        // Act
        await expect(autoWireitConfigSchema.parseAsync({ extends: [1], plugins })).rejects.toThrow();
    });
});
