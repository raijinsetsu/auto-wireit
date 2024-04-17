/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    clearMocks: true,
    displayName: 'auto-wireit',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    preset: 'ts-jest/presets/default-esm',
};

export default config;
