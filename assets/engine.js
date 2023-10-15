import runL0 from "./strategy/l0.js";
import runL1 from "./strategy/l1.js";
import runL2 from "./strategy/l2.js";
import runL3 from "./strategy/l3.js";
import runL4 from "./strategy/l4.js";
import runL5 from "./strategy/l5.js";

export default class Engine {
    constructor(options = {
        mode: 'L0',
    }) {
        this.mode = options.mode;
    }

    autoMove(game) {
        const strategies = {
            L0: runL0,
            L1: runL1,
            L2: runL2,
            L3: runL3,
            L4: runL4,
            L5: runL5,
        };

        console.log('======================');
        const step = strategies[this.mode](game);
        const {x, y} = step.piece;
        return game.tryMove([x, y], step.to);
    }
}
