import assert from "assert";
import { getRoleByName, getX, getDistance, getPosition, move } from "../assets/replay.js";
import Game from "../assets/game.js";
import Piece from "../assets/piece.js";

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

    it('getDistance should ok', () => {
        assert.equal(getDistance('一'), 1);
    });

    it('getPosition, should ok', () => {
        assert.equal(getPosition('一'), 8);
    });

    it('move() for pao should ok', () => {
        const game = new Game();
        game.initGame();
        move(game, '炮二平五');
        assert.deepStrictEqual(game.find(4, 7), new Piece('pao', 'red', 4, 7));
        move(game, '炮2平6');
        assert.deepStrictEqual(game.find(5, 2), new Piece('pao', 'black', 5, 2));
        move(game, '炮八进二');
        assert.deepStrictEqual(game.find(1, 5), new Piece('pao', 'red', 1, 5));
        move(game, '炮8进2');
        assert.deepStrictEqual(game.find(7, 4), new Piece('pao', 'black', 7, 4));
        move(game, '炮八退二');
        assert.deepStrictEqual(game.find(1, 7), new Piece('pao', 'red', 1, 7));
        move(game, '炮8退2');
        assert.deepStrictEqual(game.find(7, 2), new Piece('pao', 'black', 7, 2));
    });

    it('move() for ma should ok', () => {
        const game = new Game();
        game.initGame();
        move(game, '马二进三');
        assert.deepStrictEqual(game.find(6, 7), new Piece('ma', 'red', 6, 7));
        move(game, '马2进3');
        assert.deepStrictEqual(game.find(2, 2), new Piece('ma', 'black', 2, 2));
        move(game, '马三退二');
        assert.deepStrictEqual(game.find(7, 9), new Piece('ma', 'red', 7, 9));
        move(game, '马3退2');
        assert.deepStrictEqual(game.find(1, 0), new Piece('ma', 'black', 1, 0));
        move(game, '马二进三');
        assert.deepStrictEqual(game.find(6, 7), new Piece('ma', 'red', 6, 7));
        move(game, '马2进3');
        assert.deepStrictEqual(game.find(2, 2), new Piece('ma', 'black', 2, 2));
        move(game, '马三退五');
        assert.deepStrictEqual(game.find(4, 8), new Piece('ma', 'red', 4, 8));
        move(game, '马3退5');
        assert.deepStrictEqual(game.find(4, 1), new Piece('ma', 'black', 4, 1));
        move(game, '马五进三');
        assert.deepStrictEqual(game.find(6, 7), new Piece('ma', 'red', 6, 7));
        move(game, '马5进3');
        assert.deepStrictEqual(game.find(2, 2), new Piece('ma', 'black', 2, 2));
    });

    it('move() for xiang should ok', () => {
        const game = new Game();
        game.initGame();
        move(game, '象三进五');
        assert.deepStrictEqual(game.find(4, 7), new Piece('xiang', 'red', 4, 7));
        move(game, '象3进5');
        assert.deepStrictEqual(game.find(4, 2), new Piece('xiang', 'black', 4, 2));
        move(game, '象五退三');
        assert.deepStrictEqual(game.find(6, 9), new Piece('xiang', 'red', 6, 9));
        move(game, '象5退3');
        assert.deepStrictEqual(game.find(2, 0), new Piece('xiang', 'black', 2, 0));
    });

    it('move() for shi should ok', () => {
        const game = new Game();
        game.initGame();
        move(game, '士四进五');
        assert.deepStrictEqual(game.find(4, 8), new Piece('shi', 'red', 4, 8));
        move(game, '士4进5');
        assert.deepStrictEqual(game.find(4, 1), new Piece('shi', 'black', 4, 1));
        move(game, '士五退四');
        assert.deepStrictEqual(game.find(5, 9), new Piece('shi', 'red', 5, 9));
        move(game, '士5退4');
        assert.deepStrictEqual(game.find(3, 0), new Piece('shi', 'black', 3, 0));
    });

    it('move() should ok', () => {
        const game = new Game();
        game.initGame();
        assert.throws(() => {
            move(game, '士三进五');
        }, /士三进五 not found/);
    });
});


