import Game from "../assets/game.js";
import assert from "assert";
import Piece from "../assets/piece.js";

describe('game.js', () => {
    it('new game should ok', () => {
        const game = new Game({ mode: 'L0' });
        assert.equal(game.pieces.length, 0);
        assert.equal(game.gameOver, false);
        assert.equal(game.counter, 0);
    });

    it('putPiece() should ok', () => {
        const game = new Game({ mode: 'L0' });
        assert.equal(game.pieces.length, 0);
        assert.equal(game.gameOver, false);
        assert.equal(game.counter, 0);
        game.putPiece(new Piece('wang', 'red', 0, 0));
        assert.equal(game.pieces.length, 1);
    });

    it('put() should ok', () => {
        const game = new Game({ mode: 'L0' });
        assert.equal(game.pieces.length, 0);
        assert.equal(game.gameOver, false);
        assert.equal(game.counter, 0);
        game.putPiece('wang', 'red', 0, 0);
        assert.equal(game.pieces.length, 1);
    });

    it('initGame() should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.initGame();
        const redPieces = game.getPieces('red');
        assert.equal(redPieces.length, 16);
        const blackPieces = game.getPieces('black');
        assert.equal(blackPieces.length, 16);
    });

    it('find() should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.initGame();
        const redWang = game.find(4, 9);
        assert.equal(redWang.role, 'wang');
        assert.equal(redWang.player, 'red');
        assert.equal(redWang.x, 4);
        assert.equal(redWang.y, 9);
    });

    it('fork() should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.initGame();
        const newGame = game.fork();
        assert.equal(newGame.pieces.length, 32);
        assert.equal(newGame.counter, 0);
    });

    it('getCurrentPlayer() should ok', () => {
        const game = new Game({ mode: 'L0' });
        assert.equal(game.getCurrentPlayer(), 'red');
        game.counter++;
        assert.equal(game.getCurrentPlayer(), 'black');
    });

    it('getOpposePlayer() should ok', () => {
        assert.equal(Game.getOpposePlayer('red'), 'black');
        assert.equal(Game.getOpposePlayer('black'), 'red');
    });

    it('getWeight() should ok', () => {
        assert.equal(Game.getWeight(null), 0);
        assert.equal(Game.getWeight(new Piece('che', 'red', 0, 0)), 5000);
        assert.equal(Game.getWeight(new Piece('ma', 'red', 0, 0)), 3000);
        assert.equal(Game.getWeight(new Piece('xiang', 'red', 0, 0)), 1000);
        assert.equal(Game.getWeight(new Piece('shi', 'red', 0, 0)), 1000);
        assert.equal(Game.getWeight(new Piece('wang', 'red', 0, 0)), 10000);
        assert.equal(Game.getWeight(new Piece('pao', 'red', 0, 0)), 3000);
        assert.equal(Game.getWeight(new Piece('bing', 'red', 0, 0)), 500);
    });

    it('getSteps() for che should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('che', 'red', 4, 5);
        const steps = game.getSteps('red', 'che', 4, 5);
        assert.deepStrictEqual(steps, [
            // up
            [4, 4, 'eat'],
            [4, 3, 'eat'],
            [4, 2, 'eat'],
            [4, 1, 'eat'],
            [4, 0, 'eat'],
            // right
            [5, 5, 'eat'],
            [6, 5, 'eat'],
            [7, 5, 'eat'],
            [8, 5, 'eat'],
            // down
            [4, 6, 'eat'],
            [4, 7, 'eat'],
            [4, 8, 'eat'],
            [4, 9, 'eat'],
            // left
            [3, 5, 'eat'],
            [2, 5, 'eat'],
            [1, 5, 'eat'],
            [0, 5, 'eat']
        ]);
        game.put('che', 'red', 4, 3); // up
        game.put('che', 'red', 6, 5); // right
        game.put('che', 'red', 4, 7); // down
        game.put('che', 'red', 2, 5); // left

        assert.deepStrictEqual(game.getSteps('red', 'che', 4, 5), [
            // up
            [4, 4, 'eat'],
            [4, 3, 'protect'],
            // right
            [5, 5, 'eat'],
            [6, 5, 'protect'],
            // down
            [4, 6, 'eat'],
            [4, 7, 'protect'],
            // left
            [3, 5, 'eat'],
            [2, 5, 'protect']
        ]);

        game.put('che', 'black', 4, 4); // up
        game.put('che', 'black', 5, 5); // right
        game.put('che', 'black', 4, 6); // down
        game.put('che', 'black', 3, 5); // left
        assert.deepStrictEqual(game.getSteps('red', 'che', 4, 5), [
            // up
            [4, 4, 'eat'],
            // right
            [5, 5, 'eat'],
            // down
            [4, 6, 'eat'],
            // left
            [3, 5, 'eat']
        ]);
    });

    it('getSteps() for ma should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('ma', 'red', 4, 5);
        const steps = game.getSteps('red', 'ma', 4, 5);
        assert.deepStrictEqual(steps, [
            // up
            [3, 3, 'eat'],
            [5, 3, 'eat'],
            // right
            [6, 4, 'eat'],
            [6, 6, 'eat'],
            // down
            [3, 7, 'eat'],
            [5, 7, 'eat'],
            // left
            [2, 4, 'eat'],
            [2, 6, 'eat']
        ]);

        game.put('che', 'black', 4, 4); // up
        game.put('che', 'black', 5, 5); // right
        game.put('che', 'black', 4, 6); // down
        game.put('che', 'black', 3, 5); // left
        assert.deepStrictEqual(game.getSteps('red', 'ma', 4, 5), []);
    });

    it('getSteps() for xiang should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('xiang', 'red', 4, 5);
        // 象眼正常的情况
        const steps = game.getSteps('red', 'xiang', 4, 7);
        assert.deepStrictEqual(steps, [
            [6, 5, 'eat'],
            [6, 9, 'eat'],
            [2, 9, 'eat'],
            [2, 5, 'eat'],
        ]);

        // 模拟象眼被堵的情况
        game.put('che', 'black', 5, 6);
        game.put('che', 'black', 5, 8);
        game.put('che', 'black', 3, 8);
        game.put('che', 'black', 3, 6);
        assert.deepStrictEqual(game.getSteps('red', 'xiang', 4, 5), []);

        game.put('xiang', 'red', 0, 7);
        // 模拟边象
        assert.deepStrictEqual(game.getSteps('red', 'xiang', 0, 7), [
            [2, 5, 'eat'],
            [2, 9, 'eat']
        ]);

        game.put('xiang', 'red', 2, 5);
        // 模拟边象
        assert.deepStrictEqual(game.getSteps('red', 'xiang', 2, 5), [
            [0, 7, 'protect']
        ]);

        game.put('xiang', 'black', 2, 4);
        // 模拟边象
        assert.deepStrictEqual(game.getSteps('black', 'xiang', 2, 4), [
            [4, 2, 'eat'],
            [0, 2, 'eat']
        ]);
    });

    it('getSteps() for shi red should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('shi', 'red', 4, 8);

        assert.deepStrictEqual(game.getSteps('red', 'shi', 4, 8), [
            [5, 7, 'eat'],
            [5, 9, 'eat'],
            [3, 9, 'eat'],
            [3, 7, 'eat'],
        ]);

        const newGame = new Game({ mode: 'L0' });
        newGame.put('shi', 'red', 3, 7);
        assert.deepStrictEqual(newGame.getSteps('red', 'shi', 3, 7), [
            [4, 8, 'eat']
        ]);

        newGame.put('shi', 'red', 5, 7);
        assert.deepStrictEqual(newGame.getSteps('red', 'shi', 5, 7), [
            [4, 8, 'eat']
        ]);

        newGame.put('shi', 'red', 5, 9);
        assert.deepStrictEqual(newGame.getSteps('red', 'shi', 5, 9), [
            [4, 8, 'eat']
        ]);

        newGame.put('shi', 'red', 3, 9);
        assert.deepStrictEqual(newGame.getSteps('red', 'shi', 3, 9), [
            [4, 8, 'eat']
        ]);
    });

    it('getSteps() for shi black should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('shi', 'black', 4, 1);

        assert.deepStrictEqual(game.getSteps('black', 'shi', 4, 1), [
            [5, 0, 'eat'],
            [5, 2, 'eat'],
            [3, 2, 'eat'],
            [3, 0, 'eat'],
        ]);

        const newGame = new Game({ mode: 'L0' });
        newGame.put('shi', 'red', 5, 0);
        assert.deepStrictEqual(newGame.getSteps('black', 'shi', 5, 0), [
            [4, 1, 'eat']
        ]);

        newGame.put('shi', 'red', 5, 2);
        assert.deepStrictEqual(newGame.getSteps('black', 'shi', 5, 2), [
            [4, 1, 'eat']
        ]);

        newGame.put('shi', 'red', 3, 2);
        assert.deepStrictEqual(newGame.getSteps('black', 'shi', 3, 2), [
            [4, 1, 'eat']
        ]);

        newGame.put('shi', 'red', 3, 0);
        assert.deepStrictEqual(newGame.getSteps('black', 'shi', 3, 0), [
            [4, 1, 'eat']
        ]);
    });

    it('getSteps() for wang red should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('wang', 'red', 4, 8);

        assert.deepStrictEqual(game.getSteps('red', 'wang', 4, 8), [
            [4, 7, 'eat'],
            [5, 8, 'eat'],
            [4, 9, 'eat'],
            [3, 8, 'eat'],
        ]);

        const newGame = new Game({ mode: 'L0' });
        newGame.put('wang', 'red', 5, 7);
        assert.deepStrictEqual(newGame.getSteps('red', 'wang', 5, 7), [
            [5, 8, 'eat'],
            [4, 7, 'eat']
        ]);

        newGame.put('wang', 'red', 5, 9);
        assert.deepStrictEqual(newGame.getSteps('red', 'wang', 5, 9), [
            [5, 8, 'eat'],
            [4, 9, 'eat']
        ]);

        newGame.put('wang', 'red', 3, 9);
        assert.deepStrictEqual(newGame.getSteps('red', 'wang', 3, 9), [
            [3, 8, 'eat'],
            [4, 9, 'eat']
        ]);

        newGame.put('wang', 'red', 3, 7);
        assert.deepStrictEqual(newGame.getSteps('red', 'wang', 3, 7), [
            [4, 7, 'eat'],
            [3, 8, 'eat']
        ]);
    });

    it('getSteps() for wang black should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('wang', 'black', 4, 1);
        assert.deepStrictEqual(game.getSteps('black', 'wang', 4, 1), [
            [4, 0, 'eat'],
            [5, 1, 'eat'],
            [4, 2, 'eat'],
            [3, 1, 'eat'],
        ]);

        const newGame = new Game({ mode: 'L0' });
        newGame.put('wang', 'black', 5, 0);
        assert.deepStrictEqual(newGame.getSteps('black', 'wang', 5, 0), [
            [5, 1, 'eat'],
            [4, 0, 'eat']
        ]);

        newGame.put('wang', 'black', 5, 2);
        assert.deepStrictEqual(newGame.getSteps('black', 'wang', 5, 2), [
            [5, 1, 'eat'],
            [4, 2, 'eat']
        ]);

        newGame.put('wang', 'black', 3, 2);
        assert.deepStrictEqual(newGame.getSteps('black', 'wang', 3, 2), [
            [3, 1, 'eat'],
            [4, 2, 'eat']
        ]);

        newGame.put('wang', 'black', 3, 0);
        assert.deepStrictEqual(newGame.getSteps('black', 'wang', 3, 0), [
            [4, 0, 'eat'],
            [3, 1, 'eat']
        ]);
    });

    it('getSteps() for wang vs wang should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('wang', 'black', 4, 1);
        game.put('wang', 'red', 4, 8);
        assert.deepStrictEqual(game.getSteps('black', 'wang', 4, 1), [
            [4, 0, 'eat'],
            [5, 1, 'eat'],
            [4, 2, 'eat'],
            [3, 1, 'eat'],
            [4, 8, 'eat']
        ]);

        assert.deepStrictEqual(game.getSteps('red', 'wang', 4, 8), [
            [4, 7, 'eat'],
            [5, 8, 'eat'],
            [4, 9, 'eat'],
            [3, 8, 'eat'],
            [4, 1, 'eat']
        ]);
    });

    it('getSteps() for pao should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('pao', 'red', 4, 8);
        assert.deepStrictEqual(game.getSteps('red', 'pao', 4, 8), [
            [4, 7, 'move'],
            [4, 6, 'move'],
            [4, 5, 'move'],
            [4, 4, 'move'],
            [4, 3, 'move'],
            [4, 2, 'move'],
            [4, 1, 'move'],
            [4, 0, 'move'],
            [5, 8, 'move'],
            [6, 8, 'move'],
            [7, 8, 'move'],
            [8, 8, 'move'],
            [4, 9, 'move'],
            [3, 8, 'move'],
            [2, 8, 'move'],
            [1, 8, 'move'],
            [0, 8, 'move']
        ]);
    });

    it('getSteps() for pao case 2 should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('pao', 'red', 4, 5);
        game.put('pao', 'red', 4, 3);
        game.put('pao', 'red', 6, 5);
        game.put('pao', 'red', 4, 7);
        game.put('pao', 'red', 2, 5);
        assert.deepStrictEqual(game.getSteps('red', 'pao', 4, 5), [
            [4, 4, 'move'],
            [5, 5, 'move'],
            [4, 6, 'move'],
            [3, 5, 'move']
        ]);
    });

    it('getSteps() for pao case 3 should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('pao', 'red', 4, 5);
        game.put('pao', 'red', 4, 3);
        game.put('pao', 'black', 4, 2);
        game.put('pao', 'red', 6, 5);
        game.put('pao', 'black', 7, 5);
        game.put('pao', 'red', 4, 7);
        game.put('pao', 'black', 4, 8);
        game.put('pao', 'red', 2, 5);
        game.put('pao', 'black', 1, 5);
        assert.deepStrictEqual(game.getSteps('red', 'pao', 4, 5), [
            [4, 4, 'move'],
            [4, 2, 'eat'],
            [5, 5, 'move'],
            [7, 5, 'eat'],
            [4, 6, 'move'],
            [4, 8, 'eat'],
            [3, 5, 'move'],
            [1, 5, 'eat'],
        ]);
    });

    it('getSteps() for pao case 4 should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('pao', 'red', 4, 5);
        game.put('pao', 'red', 4, 3);
        game.put('pao', 'red', 4, 2);
        game.put('pao', 'red', 6, 5);
        game.put('pao', 'red', 7, 5);
        game.put('pao', 'red', 4, 7);
        game.put('pao', 'red', 4, 8);
        game.put('pao', 'red', 2, 5);
        game.put('pao', 'red', 1, 5);
        assert.deepStrictEqual(game.getSteps('red', 'pao', 4, 5), [
            [4, 4, 'move'],
            [4, 2, 'protect'],
            [5, 5, 'move'],
            [7, 5, 'protect'],
            [4, 6, 'move'],
            [4, 8, 'protect'],
            [3, 5, 'move'],
            [1, 5, 'protect'],
        ]);
    });

    it('getSteps() for bing should ok', () => {
        const game = new Game({ mode: 'L0' });
        game.put('bing', 'red', 4, 5);
    
        assert.deepStrictEqual(game.getSteps('red', 'bing', 4, 5), [
            [4, 4, 'eat']
        ]);

        game.put('bing', 'black', 4, 4);
    
        assert.deepStrictEqual(game.getSteps('black', 'bing', 4, 4), [
            [4, 5, 'eat']
        ]);

        game.put('bing', 'red', 2, 4);
    
        assert.deepStrictEqual(game.getSteps('red', 'bing', 2, 4), [
            [2, 3, 'eat'],
            [1, 4, 'eat'],
            [3, 4, 'eat']
        ]);

        game.put('bing', 'black', 2, 5);
    
        assert.deepStrictEqual(game.getSteps('black', 'bing', 2, 5), [
            [2, 6, 'eat'],
            [1, 5, 'eat'],
            [3, 5, 'eat']
        ]);
    });
});
