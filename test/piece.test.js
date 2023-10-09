import assert from "assert";
import Piece from "../assets/piece.js";

describe('piece.js', () => {
    it('new Piece() should ok', () => {
        const wang = new Piece('wang', 'red', 4, 7);
        assert.equal(wang.role, 'wang');
        assert.equal(wang.player, 'red');
        assert.equal(wang.x, 4);
        assert.equal(wang.y, 7);
    });

    it('fork() should ok', () => {
        const wang = new Piece('wang', 'red', 4, 7);
        const newWang = wang.fork();
        assert.equal(newWang.role, 'wang');
        assert.equal(newWang.player, 'red');
        assert.equal(newWang.x, 4);
        assert.equal(newWang.y, 7);
    });

    it('toString() should ok', () => {
        const wang = new Piece('wang', 'red', 4, 7);
        assert.equal(wang.toString(), 'red/wang(4, 7)');
    });
});
