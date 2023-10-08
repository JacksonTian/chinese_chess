import Game from "../game.js";
import { random } from "../util.js";

function findKillSteps(game, all) {
    return all.filter(({ to }) => {
        const [x, y] = to;
        const find = game.find(x, y);
        return find && find.role === 'wang';
    });
}

function findThreatSteps(game, all, player) {
    return all.filter(({ piece, to }) => {
        const newGame = game.fork();
        newGame.tryMove([piece.x, piece.y], to);
        // 废弃走棋后，王会死的步骤
        if (newGame.getRisks(player).find((d) => {
            const p = newGame.find(d.to[0], d.to[1]);
            if (p.role === 'wang') {
                return true;
            }
            return false;
        })) {
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

function getMustKillStep(game, all, player, level = 0) {
    if (level > 4) {
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
    const killSteps = findKillSteps(game, all);

    if (killSteps.length > 0) {
        return random(killSteps);
    }

    // 寻找绝杀步骤
    const finalStep = getMustKillStep(game, all, player);
    if (finalStep) {
        console.log('形成绝杀');
        return finalStep;
    }

    const steps = all.map(({ piece, to }) => {
        // 检查目标位置的棋子
        const [x, y] = to;

        const newGame = game.fork();
        const preRisks = newGame.getRisks(player);
        console.log('before risks');
        console.log(preRisks);
        const protectSteps = newGame.getAvailableSteps(player);
        const before = Game.caculateRisks(preRisks.map((d) => {
            return newGame.find(d.to[0], d.to[1]);
        }).filter((d) => {
            const s = protectSteps.filter((item) => {
                return item.to[0] === d.x && item.to[1] === d.y;
            });
            if (s.length === 0) {
                return true;
            }
            return false;
        }));
        newGame.tryMove([piece.x, piece.y], [x, y]);
        const income = Game.getWeight(newGame.eated);
        const risks = newGame.getRisks(player);

        // 走棋之后王仍然处理威胁中
        const lose = risks.find((d) => {
            const piece = newGame.find(d.to[0], d.to[1]);
            if (piece.role === 'wang' && piece.player === player) {
                return true;
            }
            return false;
        });

        const protectSteps2 = newGame.getAvailableSteps(player);
        const after = Game.caculateRisks(risks.map((d) => {
            return newGame.find(d.to[0], d.to[1]);
        }).filter((d) => {
            const protectSteps = protectSteps2.filter((item) => {
                return item.to[0] === d.x && item.to[1] === d.y;
            });
            if (protectSteps.length === 0) {
                return true;
            }

            if (protectSteps.find((item) => {
                // 保护你的人权重比你低，就是伪保护
                if (Game.getWeight(item.piece) < Game.getWeight(d)) {
                    return true;
                }
                return false;
            })) {
                return true;
            }



            return false;
        }));

        return {
            piece,
            to,
            income,
            beforeRisks: preRisks,
            before,
            afterRisks: risks,
            after,
            lose: !!lose
        };
    }).filter((d) => {
        if (d.lose) {
            return false;
        }
        return true;
    });

    // if (steps.length === 0) {
    //     alert(`${opposePlayer} win the game!`);
    //     this.gameOver = true;
    //     return;
    // }

    steps.sort((a, b) => {
        if (a.after - a.income < b.after - b.income) {
            return -1;
        }

        if (a.income !== b.income) {
            return (a.income > b.income) ? -1 : 1;
        }

        const diffA = a.after - a.before;
        const diffB = b.after - b.before;
        return diffA < diffB ? -1 : 1;
    });

    console.log(steps);
    const step = steps[0];
    if (step.income === 0 && step.after - step.before === 0) {
        return random(steps);
    }

    return step;
}
