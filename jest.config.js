/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    collectCoverageFrom: ['src/**/*.ts', '!*.test.ts'],
    coverageReporters: ['lcov', ['text', { skipFull: true }]],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    projects: ['<rootDir>/packages/*'],
};

export default config;
