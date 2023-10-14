import runL0 from "./strategy/l0.js";
import runL1 from "./strategy/l1.js";
import runL2 from "./strategy/l2.js";
import runL3 from "./strategy/l3.js";
import runL4 from "./strategy/l4.js";
import runL5 from "./strategy/l5.js";

export default class Engine {
    constructor(game, options = {
        mode: 'L0',
    }) {
        this.game = game;
        this.mode = options.mode;
    }

    autoMove() {
        const strategies = {
            L0: runL0,
            L1: runL1,
            L2: runL2,
            L3: runL3,
            L4: runL4,
            L5: runL5,
        };

        console.log('======================');
        const step = strategies[this.mode](this.game);
        const {x, y} = step.piece;
        return this.game.tryMove([x, y], step.to);
    }
}
