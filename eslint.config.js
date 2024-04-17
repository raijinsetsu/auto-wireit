import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import monorepoCop from 'eslint-plugin-monorepo-cop';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);

const config = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        files: ['**/*.test.ts'],
        rules: {
            '@typescript-eslint/require-await': 'off',
        },
    },
    {
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json', './packages/*/tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: { 'monorepo-cop': monorepoCop },
        rules: {
            ...prettier.rules,
            '@typescript-eslint/no-unused-vars': [0, { argsIgnorePattern: '^_' }],
        },
    },
);

export default config;
