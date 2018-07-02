/**
 * checks if the typings are correct
 * run via 'npm run test:typings'
 */
const assert = require('assert');
const path = require('path');
const AsyncTestUtil = require('async-test-util');

describe('typings.test.js', () => {
    const mainPath = path.join(__dirname, '../');
    const codeBase = `
        import unload = require('${mainPath}');
    `;
    const transpileCode = async (code) => {
        const spawn = require('child-process-promise').spawn;
        const stdout = [];
        const stderr = [];
        const promise = spawn('ts-node', [
            '--no-cache',
            '--compilerOptions', '{"target":"es6", "strict": true, "strictNullChecks": true}',
            '--type-check',
            '-p', codeBase + '\n' + code
        ]);
        const childProcess = promise.childProcess;
        childProcess.stdout.on('data', data => stdout.push(data.toString()));
        childProcess.stderr.on('data', data => stderr.push(data.toString()));
        try {
            await promise;
        } catch (err) {
            throw new Error(`could not run
                # Error: ${err}
                # Output: ${stdout}
                # ErrOut: ${stderr}
                `);
        }
    };
    describe('basic', () => {
        it('should sucess on basic test', async () => {
            await transpileCode('console.log("Hello, world!")');
        });
        it('should fail on broken code', async () => {
            const brokenCode = `
                let x: string = 'foo';
                x = 1337;
            `;
            let thrown = false;
            try {
                await transpileCode(brokenCode);
            } catch (err) {
                thrown = true;
            }
            assert.ok(thrown);
        });
    });
    describe('usage', () => {
        it('should bet ok use some methods from the docs', async () => {
            const code = `
                (async()=>{
                    const stopListen = unload.add(function(){
                        console.log('Ouch, Im dying.');
                    });
                    stopListen();
                    unload.runAll();
                    unload.removeAll();
                })();
            `;
            await transpileCode(code);
        });
    });
});
