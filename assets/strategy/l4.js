import Game from "../game.js";

function getResistPoints(game, attacker, victim) {
    const { piece, to } = attacker;
    if (piece.role === 'che') {
        return this.getSteps(piece.player, piece.role, piece.x, piece.y).filter((d) => {
            // 攻击路径
            if (d[0] === victim.x) {
                if (victim.y < piece.y && d[1] < piece.y) {
                    return true;
                } else if (victim.y > piece.y && d[1] > piece.y) {
                    return true;
                }
            } else if (d[1] === victim.y) {
                if (victim.x < piece.x && d[0] < piece.x) {
                    return true;
                } else if (victim.x > piece.x && d[0] > piece.x) {
                    return true;
                }
            }
            return false;
        }).filter((d) => {
            return !(d[0] === victim.x && d[1] === victim.y);
        });
    } else if (piece.role === 'ma') {
        const points = [];
        if (victim.y === piece.y - 2 && (victim.x === piece.x + 1 || victim.x === piece.x - 1)) {
            points.push([victim.x, victim.y - 1]);
        }

        if (victim.x === piece.x + 2 && (victim.y === piece.y - 1 || victim.y === piece.y + 1)) {
            points.push([victim.x + 1, victim.y]);
        }

        if (victim.y === piece.y + 2 && (victim.x === piece.x - 1 || victim.x === piece.x + 1)) {
            points.push([victim.x, victim.y + 1]);
        }
        if (victim.x === piece.x - 2 && (victim.y === piece.y - 1 || victim.y === piece.y + 1)) {
            points.push([victim.x - 1, victim.y]);
        }

        return points;
    } else if (piece.role === 'pao') {
        return this.getSteps(piece.player, piece.role, piece.x, piece.y).filter((d) => {
            // 攻击路径
            if (d[0] === victim.x) {
                if (victim.y < piece.y && d[1] < piece.y) {
                    return true;
                } else if (victim.y > piece.y && d[1] > piece.y) {
                    return true;
                }
            } else if (d[1] === victim.y) {
                if (victim.x < piece.x && d[0] < piece.x) {
                    return true;
                } else if (victim.x > piece.x && d[0] > piece.x) {
                    return true;
                }
            }
            return false;
        }).filter((d) => {
            return !(d[0] === victim.x && d[1] === victim.y);
        });
    } else if (piece.role === 'xiang') {
        const points = [];
        if (victim.y === piece.y - 2 && victim.x === piece.x + 2) {
            points.push([victim.x - 1, victim.y + 1]);
        }

        if (victim.y === piece.y + 2 && victim.x === piece.x + 2) {
            points.push([victim.x - 1, victim.y - 1]);
        }

        if (victim.y === piece.y + 2 && victim.x === piece.x - 2) {
            points.push([victim.x + 1, victim.y - 1]);
        }

        if (victim.y === piece.y - 2 && victim.x === piece.x - 2) {
            points.push([victim.x + 1, victim.y + 1]);
        }

        return points;
    }

    return [];
}

function getRisks(game, player) {
    const risks = [];
    const pieces = game.getPieces(player);
    // 获取对方候选步骤
    const steps = game.getCandidateSteps(player === 'red' ? 'black' : 'red');
    for (const piece of pieces) {
        const riskSteps = steps.filter((step) => {
            const [x, y] = step.to;
            return piece.x == x && piece.y === y;
        });

        if (riskSteps.length > 0) {
            risks.push(...riskSteps);
        }
    }
    return risks;
}

function filterOut(all, currentPlayer) {
    const opposeSteps = this.getAvailableSteps(currentPlayer === 'black' ? 'red' : 'black');
    return all.filter(({ piece, to }) => {
        // 检查目标位置的棋子
        const [x, y, action] = to;

        const newGame = this.fork();
        const preRisks = getRisks(newGame, currentPlayer);
        console.log('before risks');
        console.log(preRisks);
        newGame.tryMove([piece.x, piece.y], [x, y]);
        const risks = getRisks(newGame, currentPlayer);
        console.log('after risks');
        console.log(risks);
        if (risks.find((d) => {
            // 给对方炮形成了炮台
            const condition = d.to[3];
            if (condition && condition.x === x && condition.y === y) {
                return true;
            }

            // 被吃
            if (d.to[0] === x && d.to[1] === y && d.to[2] !== 'move') {
                return true;
            }

            const etaed = newGame.find(d.to[0], d.to[1]);
            if (Game.getWeight(etaed) > Game.getWeight(newGame.etaed)) {
                return true;
            }

            return false;
        })) {
            // 如果陷入到新的风险中，不走该步
            return false;
        }

        if (action === 'move') {
            if (opposeSteps.find((d) => {
                if (d.role === 'pao') {
                    const condition = d.to[3];
                    // 如果自己就是炮台的时候，是不构成威胁的
                    if (condition && condition.x === piece.x && condition.y === piece.y) {
                        return false;
                    }
                }

                return (d.to[0] === x && d.to[1] === y && d.to[2] !== 'move');
            })) {
                console.log(`过滤步骤：${piece.role}(${piece.x}, ${piece.y}), to (${x}, ${y})`);
                return false;
            }
        } else {
            // 如果下一步被吃
            const eatStep = opposeSteps.find((d) => {
                return (d.to[0] === x && d.to[1] === y && d.to[2] !== 'move');
            });

            if (eatStep) {
                const eated = this.find(x, y);
                if (!eated) {
                    // 如果没吃到棋子，放弃
                    return false;
                }
                // 如果吃到棋子，计算权重
                if (Game.getWeight(piece) - Game.getWeight(this.eated) >= Game.getWeight(eated)) {
                    console.log(Game.getWeight(piece));
                    console.log(Game.getWeight(eated));
                    console.log(`${piece.toString()} eat ${eated.toString()}`);
                    return false;
                }
            }
        }

        return true;
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
    const opposePlayer = player === 'black' ? 'red' : 'black';
    // Step 0: 看看是否有制胜的步骤
    const opposeWang = this.pieces.find((d) => {
        return d.role === 'wang' && d.player === opposePlayer;
    });

    const victoryStep = all.find((d) => {
        return d.to[0] === opposeWang.x && d.to[1] === opposeWang.y;
    });
    
    if  (victoryStep) {
        return victoryStep;
    }

    // 
    const opposeSteps = game.getAvailableSteps(opposePlayer);
    // 找出当下面临的所有风险
    const risks = getRisks(game, player);
    console.log('潜在风险');
    console.log(risks);

    // 找到被威胁的棋子
    const beThreated = risks.map((item) => {
        return this.find(item.to[0], item.to[1]);
    });
    console.log(`be threated: `);
    beThreated.sort((a, b) => {
        return Game.getWeight(a) > Game.getWeight(b) ? -1 : 1;
    });

    // 找出被威胁的步骤
    // 判断被威胁的棋子是否同时被保护
    const needToProtect = [];
    let remain = all;

    for (const piece of beThreated) {
        const protectSteps = all.filter((item) => {
            return item.to[0] === piece.x && item.to[1] === piece.y;
        });
        if (protectSteps.length === 0) {
            console.log(`need to protect: ${piece.role}(${piece.x}, ${piece.y})`)
            needToProtect.push(piece);
        } else {
            for (let i = 0; i < protectSteps.length; i++) {
                const step = protectSteps[i];
                remain = remain.filter((item) => {
                    if (item.piece.role !== step.piece.role) {
                        return true;
                    }

                    if (item.piece.player !== step.piece.player) {
                        return true;
                    }

                    if (item.piece.x !== step.piece.x) {
                        return true;
                    }

                    if (item.piece.y !== step.piece.y) {
                        return true;
                    }

                    if (item.to[0] !== step.to[0]) {
                        return true;
                    }

                    if (item.to[1] !== step.to[1]) {
                        return true;
                    }

                    return false;
                });
            }
        }
    }

    // 如果有需要被保护的棋子
    if (needToProtect.length > 0) {
        // 处理威胁
        const protect = needToProtect.sort((a, b) => {
            return Game.getWeight(a) > Game.getWeight(b) ? -1 : 1;
        });
        // 找到需要优先保护的棋子
        const topPiece = protect[0];
        console.log(topPiece);
        const topRisks = risks.filter((d) => {
            return d.to[0] === topPiece.x && d.to[1] === topPiece.y;
        });
        console.log(`头部威胁：`)
        console.log(topRisks);
        console.log(`寻找消灭威胁者步骤`);
        const clearRiskSteps = topRisks.reduceRight((pre, risk) => {
            // 尝试消灭威胁者
            // 先找出可清理威胁者的步骤
            pre.push(...remain.filter((step) => {
                const { piece, to } = step;
                // 检查目标位置的棋子
                const [x, y] = to;
                if (risk.piece.x === x && risk.piece.y === y) {
                    return true;
                }
                return false;
            }));
            return pre;
        }, []);

        console.log(clearRiskSteps);

        if (clearRiskSteps.length > 0) {
            const step = Game.random(clearRiskSteps);
            this.tryMove([step.piece.x, step.piece.y], step.to);
            return;
        }

        // 寻找抵挡步骤
        console.log(`寻找抵挡步骤`);
        const weight = Game.getWeight(topPiece);
        const resistSteps = topRisks.reduceRight((pre, risk) => {
            const steps = remain.filter((step) => {
                // 找出非自身棋子的步骤
                return step.piece.x !== topPiece.x || step.piece.y !== topPiece.y;
            }).filter((step) => {
                // 高权重不替低权重棋子抵挡
                if (Game.getWeight(step.piece) >= weight) {
                    return false;
                }

                const candidateSteps = getResistPoints(game, risk, topPiece);

                // 可以抵挡在对方的行进路线中
                if (candidateSteps.find((d) => {
                    return step.to[0] === d[0] && step.to[1] === d[1];
                })) {
                    return true;
                }

                // if (risk.piece.role === 'pao') {
                //     const condition = risk.to[3];
                //     if (condition && condition.player === topPiece.player) {
                //         // 
                //         this.getSteps(condition.player, condition.role, condition.x, condition.y).filter((d) => {

                //         });
                //     }
        
                //     return steps;
                // }

                return false;
            });

            pre.push(...steps);

            return pre;
        }, []);

        console.log(resistSteps);

        if (resistSteps.length > 0) {
            console.log(`执行抵挡步骤`);
            const step = Game.random(resistSteps);
            this.tryMove([step.piece.x, step.piece.y], step.to);
            return;
        }

        console.log(`寻找保护步骤`);
        // 找出可行的步骤中，可以保护该棋子的那步
        const s = remain.filter((step) => {
            // 找出非自身棋子的步骤
            return step.piece.x !== topPiece.x && step.piece.y !== topPiece.y;
        }).filter((step) => {
            // 如果被威胁的是王，忽略所有保护步骤
            if (topPiece.role === 'wang') {
                return false;
            }

            const { piece, to } = step;
            // 检查目标位置的棋子
            const [x, y] = to;
            const steps = this.getSteps(piece.player, piece.role, x, y);
            // 找出可保护该棋子的步骤
            // 1.1 找到一个可以保护它的步骤
            const find = steps.find((to) => {
                return to[0] === topPiece.x && to[1] === topPiece.y && to[2] === 'protect';
            });

            if (find) {
                return true;
            }

            return false;
        }).filter((step) => {
            const { piece, to } = step;
            // 检查目标位置的棋子
            const [x, y] = to;
            // 过滤掉无效保护
            if (opposeSteps.find((d) => {
                return d.to[0] === x && d.to[1] === y && d.to[2] !== 'move';
            })) {
                return false;
            }
            return true;
        });

        console.log(s);

        if (s.length > 0) {
            console.log(`随机选择一步保护措施`);
            const step = Game.random(s);
            this.tryMove([step.piece.x, step.piece.y], step.to);
            return;
        }

        console.log(`寻找躲避步骤`);
        // 找不到可以保护该棋子的情况下，尝试看看自身是否可以躲避
        const avoidSteps = remain.filter((step) => {
            // 找出躲避步骤
            return step.piece.x === top.x && step.piece.y === top.y;
        }).filter((step) => {
            const { piece, to } = step;
            // 检查目标位置的棋子
            const [x, y] = to;
            // 过滤掉无效躲避
            if (opposeSteps.find((d) => {
                return d.to[0] === x && d.to[1] === y && d.to[2] !== 'move';
            })) {
                return false;
            }
            return true;
        });

        console.log(avoidSteps);

        if (avoidSteps.length > 0) {
            console.log(`执行躲避步骤`);
            const step = Game.random(avoidSteps);
            this.tryMove([step.piece.x, step.piece.y], step.to);
            return;
        }

        if (topPiece.role === 'wang') {
            console.log('必输局面');
            this.gameOver = true;
            return;
        }
    }

    console.log('remain steps:');
    console.log();

    // 过滤低收益步骤
    const remainSteps = this.filterOut(remain, player)
    // 兜底随便走一步
    // 找到有收益的步骤
    if (remainSteps.length > 0) {
        console.log(`兜底找到收益最高的步骤`);
        this.L3(remainSteps);
        return;
    }

    console.log(`兜底使用L3方式走一步`);
    this.L3(all);
}