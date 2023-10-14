import Game from "../game.js";

function getIncome(game, role, player, x, y) {
    const newGame = game.fork();
    const steps = newGame.getSteps(player, role, x, y);
    return steps.reduceRight((pre, step) => {
        const find = newGame.find(step[0], step[1]);
        return pre + Game.getWeight(find);
    }, 0);
}

/**
 * 
 * @param {Game} game 
 * @returns 
 */
export default function run(game) {
    const player = game.getCurrentPlayer();
    const all = game.getCandidateSteps(player);
    const allWithWeight = all.map((step) => {
        const { piece, to } = step;
        // 检查目标位置的棋子
        const [x, y] = to;
        const find = game.find(x, y);
        return {
            ...step,
            weight0: Game.getWeight(find),
            // 间接收益
            weight1: getIncome(game, piece.role, piece.player, x, y),
        };
    });
    // 收益计算
    allWithWeight.sort((a, b) => {
        if (a.weight0 !== b.weight0) {
            return a.weight0 > b.weight0 ? -1 : 1;
        } else if (a.weight1 !== b.weight1) {
            return a.weight1 > b.weight1 ? -1 : 1;
        }
        return 0;
    });
    allWithWeight.forEach((d) => {
        console.log(`${d.piece.role}(${d.piece.x}, ${d.piece.y}) to (${d.to[0]}, ${d.to[1]}), weight0: ${d.weight0}, weight1: ${d.weight1}`);
    });
    return allWithWeight[0];
}