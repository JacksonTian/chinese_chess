export default class Piece {
    /**
     * 
     * @param {String} role 
     * @param {String} player red or black
     * @param {Number} x x-axis number, from 0 to 8
     * @param {Number} y y-axis number, from 0 to 9
     */
    constructor(role, player, x, y) {
        this.role = role;
        this.player = player;
        this.x = x;
        this.y = y;
    }

    fork() {
        return new Piece(this.role, this.player, this.x, this.y);
    }

    toString() {
        return `${this.player}/${this.role}(${this.x}, ${this.y})`;
    }
}
