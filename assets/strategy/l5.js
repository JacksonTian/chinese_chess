import Game from "../game.js";
import { random } from "../util.js";

/**
 * 找出杀死王的所有步骤
 * @param {Game} game 
 * @param {*} all 
 * @returns 
 */
function findKillSteps(game, all) {
    return all.filter(({ to }) => {
        const [x, y, action] = to;
        const find = game.find(x, y);
        return find && find.role === 'wang' && action === 'eat';
    });
}

/**
 * 找出对方可以吃子的步骤
 * @param {Game} game 
 * @param {String} player 
 * @returns 
 */
function getRisks(game, player) {
    const opposePlayer = Game.getOpposePlayer(player);
    // 获取对方候选步骤
    const steps = game.getCandidateSteps(opposePlayer);
    return steps.filter((step) => {
        const [x, y, action] = step.to;
        const piece = game.find(x, y);
        if (piece && piece.player === player && action === 'eat') {
            return true;
        }
        return false;
    });
}

/**
 * 
 * @param {Game} game 
 * @param {*} player 
 * @returns 
 */
function getIncomes(game, player) {
    const steps = game.getCandidateSteps(player);
    return steps.reduceRight((pre, step) => {
        const [x, y] = step.to;
        const find = game.find(x, y);
        return pre + Game.getWeight(find);
    }, 0);
}

function findThreatSteps(game, all, player) {
    return all.filter(({ piece, to }) => {
        const newGame = game.fork();
        newGame.tryMove([piece.x, piece.y], to);
        // 废弃走棋后，王会死的步骤
        const riskSteps = getRisks(newGame, player);
        const deadStep = riskSteps.find((d) => {
            const p = newGame.find(d.to[0], d.to[1]);
            return p.role === 'wang';
        });

        if (deadStep) {
            return false;
        }

        const steps = newGame.getCandidateSteps(player);
        const killSteps = findKillSteps(newGame, steps);
        if (killSteps.length > 0) {
            return true;
        }

        return false;
    });
}

function caculateRisks(game, player) {
    const risks = getRisks(game, player);
    return risks.map(({piece, to}) => {
        const opposePlayer = Game.getOpposePlayer(player);
        const attacker = piece;
        const [x, y] = to;
        const victim = game.find(x, y);
        const newGame = game.fork();
        // 执行威胁步骤 step 1
        newGame.tryMove([piece.x, piece.y], [x, y]);
        const steps = newGame.getAvailableSteps(player);
        const prototects = steps.filter((item) => {
            return item.to[0] === x && item.to[1] === y;
        }).filter((d) => {
            const g = newGame.fork();
            // 执行保护步骤 step 2
            g.tryMove([d.piece.x, d.piece.y], [x, y]);

            if (findKillSteps(g, g.getCandidateSteps(opposePlayer)).length > 0) {
                return false;
            }

            return true;
        });

        if (prototects.length === 0) {
            // 如果没有保护，净风险就是当前这个子
            return Game.getWeight(victim);
        }

        // 攻击者的权重低于被攻击者，净风险也是当前这个子。比如马要吃车
        if (Game.getWeight(attacker) < Game.getWeight(victim)) {
            return Game.getWeight(victim);
        }

        // 兵保护炮，不怕车来吃
        return 0;
    }).reduceRight((pre, current) => {
        return pre + current;
    }, 0);
}

/**
 * 递归找出可以形成绝杀的一步
 * @param {Game} game 
 * @param {*} all 
 * @param {*} player 
 * @param {*} level 
 * @returns 
 */
function getMustKillStep(game, all, player, level = 0) {
    if (level > 5) {
        return;
    }

    const opposePlayer = Game.getOpposePlayer(player);
    const threatSteps = findThreatSteps(game, all, player);
    return threatSteps.find((d) => {
        const newGame = game.fork();
        newGame.tryMove([d.piece.x, d.piece.y], d.to); // step 1
        const steps = newGame.getCandidateSteps(opposePlayer);
        return steps.every((item) => {
            const ng = newGame.fork();
            ng.tryMove([item.piece.x, item.piece.y], item.to); // step 2
            const ss = ng.getCandidateSteps(player);
            if (findKillSteps(ng, ss).length > 0) {
                return true;
            }

            if (getMustKillStep(ng, ss, player, level + 1)) {
                return true;
            }

            return false;
        });
    });
}

/**
 * 
 * @param {Game} game 
 * @returns 
 */
export default function run(game) {
    const player = game.getCurrentPlayer();
    const all = game.getCandidateSteps(player);

    // 找出直接取胜的步骤
    const killSteps = findKillSteps(game, all);
    if (killSteps.length > 0) {
        console.log('取胜');
        return random(killSteps);
    }

    // 过滤掉走棋后，王会被杀的步骤，比如给炮当墩子
    let remainSteps = all.filter(({piece, to}) => {
        const newGame = game.fork();
        const [x, y] = to;
        newGame.tryMove([piece.x, piece.y], [x, y]);
        const opposeSteps = newGame.getCandidateSteps(Game.getOpposePlayer(player));
        if (findKillSteps(newGame, opposeSteps).length > 0) {
            return false;
        }
        return true;
    });

    // 如果走棋后，王始终处于威胁中，随机走一步，等待进入失败
    if (remainSteps.length === 0) {
        console.log('进入死局')
        return random(all);
    }

    // 寻找绝杀步骤。比如形成重重炮
    const finalStep = getMustKillStep(game, remainSteps, player);
    if (finalStep) {
        console.log('形成绝杀');
        return finalStep;
    }

    const steps = remainSteps.map(({ piece, to }) => {
        // 检查目标位置的棋子
        const [x, y] = to;

        const newGame = game.fork();
        const before = caculateRisks(newGame, player);
        const beforeIndirect = getIncomes(newGame, player);
        newGame.tryMove([piece.x, piece.y], [x, y]);
        const income = Game.getWeight(newGame.eated);
        const after = caculateRisks(newGame, player);
        const indirect = getIncomes(newGame, player);

        return {
            piece,
            to,
            income,
            before,
            after,
            indirect: indirect - beforeIndirect,
            benefit: income - (after - before) // 收益 - 新增风险
        };
    });

    steps.sort((a, b) => {
        if (a.benefit === b.benefit) {
            return a.indirect > b.indirect ? -1 : 1;
        }

        return a.benefit > b.benefit ? -1 : 1;
    });

    steps.forEach((d) => {
        console.log(`${d.piece.role}(${d.piece.x}, ${d.piece.y}) to (${d.to[0]}, ${d.to[1]}), benefit: ${d.benefit}(${d.before}/${d.after}), indirect: ${d.indirect}`);
    })

    return steps[0];
}
