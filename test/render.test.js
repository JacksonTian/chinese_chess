import assert from "assert";

import Piece from "../assets/piece.js";
import GameRender from "../assets/render.js";

describe('render.js', () => {
    it('getName() should ok', () => {
        assert.equal(GameRender.getName(new Piece('wang', 'red', 0, 0)), '帅');
        assert.equal(GameRender.getName(new Piece('wang', 'black', 0, 0)), '将');
    });
});