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
        const [x, y] = to;
        return {
            ...step,
            // 间接收益
            weight: getIncome(game, piece.role, piece.player, x, y),
        };
    });
    // 收益计算
    allWithWeight.sort((a, b) => {
        return a.weight > b.weight ? -1 : 1;
    });
    allWithWeight.forEach((d) => {
        console.log(`${d.piece.role}(${d.piece.x}, ${d.piece.y}) to (${d.to[0]}, ${d.to[1]}), weight: ${d.weight}`);
    });

    return allWithWeight[0];
}