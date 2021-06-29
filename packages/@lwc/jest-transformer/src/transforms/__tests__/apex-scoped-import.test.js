/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../apex-scoped-import'));

describe('@salesforce/apex import', () => {
    test(
        'does default transformation',
        `
        import myMethod from '@salesforce/apex/FooController.fooMethod';
    `,
        `
        let myMethod;

        try {
          myMethod = require("@salesforce/apex/FooController.fooMethod").default;
        } catch (importSourceNotDefined) {
          global._apexMethodsModuleRegistryHack = global._apexMethodsModuleRegistryHack || {};
        
          try {
            const {
              createApexTestWireAdapter
            } = require('@salesforce/wire-service-jest-util');
        
            global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] = global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] || createApexTestWireAdapter(jest.fn().mockImplementation(() => Promise.resolve()));
          } catch (wireServiceJestUtilNotDefined) {
            global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] = global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] || function myMethod() {
              return Promise.resolve();
            };
          }
        
          myMethod = global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"];
        }
    `
    );

    test(
        'allows non-@salesforce/apex named imports',
        `
        import { otherNamed } from './something-valid';
        import myMethod from '@salesforce/apex/FooController.fooMethod';
    `,
        `
        import { otherNamed } from './something-valid';
        let myMethod;

        try {
          myMethod = require("@salesforce/apex/FooController.fooMethod").default;
        } catch (importSourceNotDefined) {
          global._apexMethodsModuleRegistryHack = global._apexMethodsModuleRegistryHack || {};
        
          try {
            const {
              createApexTestWireAdapter
            } = require('@salesforce/wire-service-jest-util');
        
            global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] = global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] || createApexTestWireAdapter(jest.fn().mockImplementation(() => Promise.resolve()));
          } catch (wireServiceJestUtilNotDefined) {
            global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] = global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"] || function myMethod() {
              return Promise.resolve();
            };
          }
        
          myMethod = global._apexMethodsModuleRegistryHack["@salesforce/apex/FooController.fooMethod"];
        }
    `
    );

    test(
        'transforms named imports from @salesforce/apex',
        `
        import { refreshApex, getSObjectValue } from '@salesforce/apex';
    `,
        `
        let refreshApex;

        try {
          refreshApex = require("@salesforce/apex").refreshApex;
        } catch (e) {
          refreshApex = function () {
            return Promise.resolve();
          };
        }

        let getSObjectValue;

        try {
          getSObjectValue = require("@salesforce/apex").getSObjectValue;
        } catch (e) {
          getSObjectValue = jest.fn();
        }
    `
    );
});
