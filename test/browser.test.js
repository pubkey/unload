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
});