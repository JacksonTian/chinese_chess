
export default class Record {
    constructor(role, player, oldX, oldY, newX, newY) {
        this.role = role;
        this.player = player;
        this.from = [oldX, oldY];
        this.to = [newX, newY];
    }
}