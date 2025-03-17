const { renderAndHashComponent, readSnapshotMarkup } = require('../ssr-snapshot-utils');
const { readdirSync, readFileSync } = require('fs');
const { createHash } = require('crypto');
const { join } = require('path');

jest.mock('@lwc/engine-server', () => ({
    renderComponent: jest.fn(),
}));

jest.mock('@lwc/ssr-runtime', () => ({
    serverSideRenderComponent: jest.fn(),
}));

jest.mock('fs', () => ({
    readdirSync: jest.fn(),
    readFileSync: jest.fn(),
}));

jest.mock('crypto', () => ({
    createHash: jest.fn(() => ({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('mockedHash'),
    })),
}));

const ssrMode = process.env.LWC_SSR_MODE || 'v2';

describe('Snapshot utilities service', () => {
    describe("'renderAndHashComponent' service to genarate markup and hash", () => {
        it('should render the component and return the markup and snapshot hash', async () => {
            const mockMarkup = '<div>some markup</div>';
            const mockTagName = 'my-component';
            const mockCtor = jest.fn();
            const mockProps = { prop: 'value' };
            const customTestEnv = { wire: '' };

            require('@lwc/engine-server').renderComponent.mockReturnValue(mockMarkup);
            require('@lwc/ssr-runtime').serverSideRenderComponent.mockReturnValue(mockMarkup);
            const result = await renderAndHashComponent(
                mockTagName,
                mockCtor,
                mockProps,
                customTestEnv
            );

            expect(result).toEqual({
                renderedComponent: mockMarkup,
                snapshotHash: 'mockedHash',
            });
            if (ssrMode === 'v1')
                expect(require('@lwc/engine-server').renderComponent).toHaveBeenCalledWith(
                    mockTagName,
                    mockCtor,
                    mockProps
                );
            else
                expect(require('@lwc/ssr-runtime').serverSideRenderComponent).toHaveBeenCalledWith(
                    mockTagName,
                    mockCtor,
                    mockProps
                );
            expect(createHash).toHaveBeenCalledWith('sha256');
        });
    });

    describe('readSnapshotMarkup', () => {
        beforeEach(() => {
            global.testFilePath = '/test/path/to/testFile.server.test.js';
        });

        it('should read the snapshot content based on the generated hash', () => {
            const mockTagName = 'my-component';
            const mockProps = { prop: 'value' };
            const mockFileContent = `
                exports[\`someKey_mockedHash_AnotherPart\`] = \`<div>Mocked Markup</div>\`;
            `;

            readdirSync.mockReturnValue(['testFile.snap.js']);
            readFileSync.mockReturnValue(mockFileContent);

            const result = readSnapshotMarkup(mockTagName, mockProps);

            expect(result).toBe('<div>Mocked Markup</div>');
            expect(readdirSync).toHaveBeenCalledWith(join('/test/path/to', '__snapshots__'));
            expect(readFileSync).toHaveBeenCalledWith(
                '/test/path/to/__snapshots__/testFile.snap.js',
                'utf8'
            );
        });

        it('should throw an error if the snapshot with the specified hash is not found', () => {
            const mockTagName = 'my-component';
            const mockProps = { prop: 'value' };
            const mockFileContent = `
                exports[\`someKey_differentHash_AnotherPart\`] = \`<div>Mocked Markup</div>\`;
            `;

            readdirSync.mockReturnValue(['testFile.snap.js']);
            readFileSync.mockReturnValue(mockFileContent);

            expect(() => readSnapshotMarkup(mockTagName, mockProps)).toThrowError(
                'Snapshot with hash mockedHash not found.'
            );
        });

        it('should throw an error if the global test file path is not set', () => {
            delete global.testFilePath;

            expect(() => readSnapshotMarkup('tagName')).toThrowError(
                'Test file path must be available in the global context.'
            );
        });
    });
});
