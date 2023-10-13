import assert from "assert";
import { random, sleep } from "../assets/util.js";

describe('util.js', () => {
    it('sleep should ok', async () => {
        const start = new Date();
        await sleep(100);
        const end = new Date();
        assert.ok(end.getTime() - start.getTime() >= 100);
    });

    it('random should ok', () => {
        assert.equal(random([1]), 1);
    });
});

