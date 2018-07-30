import AsyncTestUtil from 'async-test-util';
import assert from 'assert';

async function pingServerCount() {
    const url = 'http://localhost:23230/json/';
    const ret = await fetch(url);
    const json = await ret.json();
    return json.counter;
}

describe('browser.test.js', () => {
    it('log', () => {
        console.log('started browser test');
    });
    it('get pingserver-count', async () => {
        const c = await pingServerCount();
        assert.ok(c >= 0);
    });
    it('increase ping', async () => {
        const countBefore = await pingServerCount();
        await fetch('http://localhost:23230/');
        const countAfter = await pingServerCount();
        assert.ok(countBefore < countAfter);
    });
    it('spawn unload-iframe and close it', async () => {
        const logValue = new Date().getTime();
        const countBefore = await pingServerCount();

        // create iframe
        const newIframe = async () => {
            const ifrm = document.createElement('iframe');
            ifrm.setAttribute('src', 'http://127.0.0.1:8080/test/helper/iframe.html?logValue=' + logValue);
            ifrm.style.width = '640px';
            ifrm.style.height = '480px';
            document.body.appendChild(ifrm);
            await new Promise(res => ifrm.onload = () => res());
            return ifrm;
        };

        // wait for load
        const ifrm = await newIframe();
        await AsyncTestUtil.wait(1000);

        // close iframe
        ifrm.parentNode.removeChild(ifrm);

        // open again
        const ifrm2 = await newIframe();
        await AsyncTestUtil.wait(1000);
        ifrm2.parentNode.removeChild(ifrm2);

        // request should have been made
        await AsyncTestUtil.waitUntil(async () => {
            const countAfter = await pingServerCount();
            return countAfter > countBefore;
        }, 0, 200);
    });
    it('should not crash inside of a webworker', async () => {
        // https://stackoverflow.com/a/40581869/3443137
        function XHRWorker(url, ready, scope) {
            return new Promise(res => {
                const oReq = new XMLHttpRequest();
                oReq.addEventListener('load', function () {
                    const worker = new Worker(window.URL.createObjectURL(new Blob([this.responseText])));
                    if (ready) {
                        ready.call(scope, worker);
                    }
                    res(worker);
                }, oReq);
                oReq.open('get', url, true);
                oReq.send();
            });
        }


        const workerUrl = 'http://127.0.0.1:8080/test_tmp/worker.js';


        const worker = await XHRWorker(workerUrl + '?t=' + new Date().getTime());
        worker.onerror = event => {
            throw new Error('worker: ' + event.message + ' (' + event.filename + ':' + event.lineno + ')');
        };
        await new Promise(res => {
            worker.addEventListener('message', msg => {
                if (msg.data === 'WORKER DONE') {
                    // worker has done
                    res();
                }
            }, false);
            worker.postMessage({
                'cmd': 'start',
                'msg': {}
            });
        });
    });
});