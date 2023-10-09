import assert from "assert";
import { getRoleByName, getX } from "../assets/replay.js";

describe('replay.js', () => {
    it('getRoleByName should ok', () => {
        assert.equal(getRoleByName('车'), 'che');
    });

    it('getX should ok', () => {
        assert.equal(getX('red', 0), '九');
        assert.equal(getX('red', 1), '八');
        assert.equal(getX('red', 2), '七');
        assert.equal(getX('red', 3), '六');
        assert.equal(getX('red', 4), '五');
        assert.equal(getX('red', 5), '四');
        assert.equal(getX('red', 6), '三');
        assert.equal(getX('red', 7), '二');
        assert.equal(getX('red', 8), '一');
        assert.equal(getX('black', 0), '1');
        assert.equal(getX('black', 1), '2');
        assert.equal(getX('black', 2), '3');
        assert.equal(getX('black', 3), '4');
        assert.equal(getX('black', 4), '5');
        assert.equal(getX('black', 5), '6');
        assert.equal(getX('black', 6), '7');
        assert.equal(getX('black', 7), '8');
        assert.equal(getX('black', 8), '9');
    });
});


