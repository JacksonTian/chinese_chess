import Game from "../game.js";

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
            weight: Game.getWeight(find)
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