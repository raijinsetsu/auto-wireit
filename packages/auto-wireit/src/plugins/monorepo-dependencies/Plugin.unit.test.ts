import { Plugin } from './Plugin.js';

describe('Plugin unit tests', () => {
    describe('findLocalLernaModules method', () => {});

    describe('findLocalModules method', () => {});

    describe('findLocalNpmModules method', () => {});

    describe('findLocalYarnModules method', () => {});

    describe('getPackageManager method', () => {});

    describe('onFinal method', () => {});

    describe('onScriptAdd method', () => {});

    describe('properties', () => {
        const plugin = new Plugin({ dependencyScriptMap: {}, names: ['test'], packageManager: 'npm' });
        const findLocalLernaModulesSpy = jest.spyOn(plugin, 'findLocalLernaModules');
        const findLocalModulesSpy = jest.spyOn(plugin, 'findLocalModules');
        const findLocalNpmModulesSpy = jest.spyOn(plugin, 'findLocalNpmModules');
        const findLocalYarnModulesSpy = jest.spyOn(plugin, 'findLocalYarnModules');
        const getPackageManagerSpy = jest.spyOn(plugin, 'getPackageManager');

        test('name returns monorepo-dependencies', async () => {
            // Assert
            expect(plugin.name).toBe('monorepo-dependencies');
        });
    });

    describe('run method', () => {});
});
