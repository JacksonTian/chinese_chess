import Piece from "./piece.js";
import Record from "./record.js";
import { getRoleByName, getPosition, getDistance } from "./replay.js";
import runL0 from "./strategy/l0.js";
import runL5 from "./strategy/l5.js";

export default class Game {
    constructor(options = {
        mode: 'L0'
    }) {
        this.pieces = [];
        this.records = [];
        this.counter = 0;
        this.gameOver = false;
        this.mode = options.mode;
        // 记录上一步被吃的棋子
        this.eated = null;
    }

    /**
     * 将棋子放到棋盘上
     * @param {String} role 
     * @param {String} player 
     * @param {Number} x 
     * @param {Number} y 
     */
    put(role, player, x, y) {
        this.putPiece(new Piece(role, player, x, y));
    }

    /**
     * 将棋子放到棋盘上
     * @param {Piece} piece 棋子
     */
    putPiece(piece) {
        this.pieces.push(piece);
    }

    /**
     * 复制一个棋局
     * @returns 一个复制的棋局
     */
    fork() {
        const game = new Game();
        for (const p of this.pieces) {
            game.putPiece(p.fork());
        }
        game.counter = this.counter;
        game.records = this.records.slice(0);

        return game;
    }

    /**
     * 根据给定坐标，找到棋子
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    find(x, y) {
        return this.pieces.find((item) => {
            return item.x === x && item.y === y;
        });
    }

    /**
     * 摆放棋盘
     */
    initGame() {
        // for black player
        this.put('che', 'black', 0, 0);
        this.put('che', 'black', 8, 0);
        this.put('ma', 'black', 1, 0);
        this.put('ma', 'black', 7, 0);
        this.put('xiang', 'black', 2, 0);
        this.put('xiang', 'black', 6, 0);
        this.put('shi', 'black', 3, 0);
        this.put('shi', 'black', 5, 0);
        this.put('wang', 'black', 4, 0);
        this.put('pao', 'black', 1, 2);
        this.put('pao', 'black', 7, 2);
        this.put('bing', 'black', 0, 3);
        this.put('bing', 'black', 2, 3);
        this.put('bing', 'black', 4, 3);
        this.put('bing', 'black', 6, 3);
        this.put('bing', 'black', 8, 3);
        // for red player
        this.put('che', 'red', 0, 9);
        this.put('che', 'red', 8, 9);
        this.put('ma', 'red', 1, 9);
        this.put('ma', 'red', 7, 9);
        this.put('xiang', 'red', 2, 9);
        this.put('xiang', 'red', 6, 9);
        this.put('shi', 'red', 3, 9);
        this.put('shi', 'red', 5, 9);
        this.put('wang', 'red', 4, 9);
        this.put('pao', 'red', 1, 7);
        this.put('pao', 'red', 7, 7);
        this.put('bing', 'red', 0, 6);
        this.put('bing', 'red', 2, 6);
        this.put('bing', 'red', 4, 6);
        this.put('bing', 'red', 6, 6);
        this.put('bing', 'red', 8, 6);
    }

    tryMove(from, to) {
        if (this.gameOver) {
            return false;
        }

        const [oldX, oldY] = from;
        const [newX, newY] = to;
        console.log(`from(${oldX}, ${oldY}) to(${newX}, ${newY})`);

        const find = this.find(oldX, oldY);
        if (!find) {
            console.log(`无可移动棋子`);
            return false;
        }

        if (this.counter % 2 === 0 && find.player !== 'red') {
            console.log(`非红方步骤`);
            return false;
        }

        if (this.counter % 2 === 1 && find.player !== 'black') {
            console.log(`非黑方步骤`);
            return false;
        }

        const target = this.find(newX, newY);

        // 目标位置有我方棋子
        if (target && target.player === find.player) {
            console.log(`目标为我方棋子`);
            return false;
        }

        const steps = this.getSteps(find.role, find.player, oldX, oldY);
        const step = steps.find((item) => {
            const [x, y, action] = item;
            return x === newX && y === newY;
        });

        if (!step) {
            console.log(`非有效步骤`);
            return false;
        }

        const index = this.pieces.findIndex((item) => {
            return (item.player !== find.player && item.x === newX && item.y === newY);
        });

        if (index !== -1) {
            console.log('发生吃兵');
            this.eated = this.pieces.find((item) => {
                return (item.player !== find.player && item.x === newX && item.y === newY);
            });
            this.pieces.splice(index, 1);
            if (target.role === 'wang') {
                console.log('game over');
                this.gameOver = true;
            }
        } else {
            this.eated = null;
        }

        this.records.push(new Record(find.role, find.player, oldX, oldY, newX, newY));

        find.x = newX;
        find.y = newY;
        console.log(`${find.player} ${find.role}(${oldX}, ${oldY}) to (${newX}, ${newY})`);
        this.counter++;
        return true;
    }

    getRisk(piece, x, y) {
        const pieces = this.pieces.filter((item) => {
            return item.player !== piece.player;
        }).filter((item) => {
            // 过滤掉目标位置的棋子
            return item.x !== x && item.y !== y;
        });

        const all = pieces.reduceRight((pre, item) => {
            const steps = this.getAvailableSteps(item.role, item.player, item.x, item.y);
            pre.push(...steps);
            return pre;
        }, []);

        const eatStep = all.find((step) => {
            return step[0] === x && step[1] === y;
        });

        if (eatStep) {
            return Game.getWeight(piece);
        }

        return 0;
    }

    getIncome(role, player, x, y) {
        const game = this.fork();
        const steps = game.getSteps(role, player, x, y);
        return steps.reduceRight((pre, step) => {
            const find = game.find(step[0], step[1]);
            return pre + Game.getWeight(find);
        }, 0);
    }

    getPieces(player) {
        return this.pieces.filter((item) => {
            return item.player === player;
        });
    }

    /**
     * 获取所有可移动，吃子的步骤
     * @param {*} player 
     * @returns 
     */
    getCandidateSteps(player) {
        const steps = this.getAvailableSteps(player);
        return steps;
    }

    /**
     * 获取所有可执行的步骤，包括保护步骤
     * @param {String} player 
     * @returns 
     */
    getAvailableSteps(player) {
        const pieces = this.getPieces(player);

        return pieces.reduceRight((pre, item) => {
            const steps = this.getSteps(item.role, item.player, item.x, item.y).map((step) => {
                return {
                    piece: item,
                    to: step
                };
            });
            pre.push(...steps);
            return pre;
        }, []);
    }

    getRisks(player) {
        const risks = [];
        const pieces = this.getPieces(player);
        // 获取对方候选步骤
        const steps = this.getCandidateSteps(player === 'red' ? 'black' : 'red');
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

    static caculateRisks(pieces) {
        return pieces.reduceRight((pre, current) => {
            return pre + Game.getWeight(current);
        }, 0);
    }

    getIncomes(player) {
        const steps = this.getCandidateSteps(player);
        return steps.filter((step) => {
            return step.to[2] === 'eat';
        });
    }

    L1(all) {
        const allWithWeight = all.map((step) => {
            const { piece, to } = step;
            // 检查目标位置的棋子
            const [x, y] = to;
            const find = this.find(x, y);
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
        const step = allWithWeight[0];
        this.tryMove([step.piece.x, step.piece.y], step.to);
    }

    L2(all) {
        const allWithWeight = all.map((step) => {
            const { piece, to } = step;
            const [x, y] = to;
            return {
                ...step,
                // 间接收益
                weight: this.getIncome(piece.role, piece.player, x, y),
            };
        });
        // 收益计算
        allWithWeight.sort((a, b) => {
            return a.weight > b.weight ? -1 : 1;
        });
        allWithWeight.forEach((d) => {
            console.log(`${d.piece.role}(${d.piece.x}, ${d.piece.y}) to (${d.to[0]}, ${d.to[1]}), weight: ${d.weight}`);
        });
        const step = allWithWeight[0];
        this.tryMove([step.piece.x, step.piece.y], step.to);
    }

    L3(all) {
        const allWithWeight = all.map((step) => {
            const { piece, to } = step;
            // 检查目标位置的棋子
            const [x, y] = to;
            const find = this.find(x, y);
            return {
                ...step,
                weight0: Game.getWeight(find),
                // 间接收益
                weight1: this.getIncome(piece.role, piece.player, x, y),
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
        const step = allWithWeight[0];
        this.tryMove([step.piece.x, step.piece.y], step.to);
    }

    L4(all) {
        const player = this.counter % 2 === 0 ? 'red' : 'black';
        const opposePlayer = player === 'black' ? 'red' : 'black';
        // Step 0: 看看是否有制胜的步骤
        const opposeWang = this.pieces.find((d) => {
            return d.role === 'wang' && d.player === opposePlayer;
        });

        const victoryStep = all.find((d) => {
            return d.to[0] === opposeWang.x && d.to[1] === opposeWang.y;
        });
        
        if  (victoryStep) {
            this.tryMove([victoryStep.piece.x, victoryStep.piece.y], victoryStep.to);
            return;
        }

        // 
        const opposeSteps = this.getAvailableSteps(opposePlayer);
        // 找出当下面临的所有风险
        const risks = this.getRisks(player);
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

                    const candidateSteps = this.getResistPoints(risk, topPiece);

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
                    //         this.getSteps(condition.role, condition.player, condition.x, condition.y).filter((d) => {

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
                const steps = this.getSteps(piece.role, piece.player, x, y);
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

    static getOpposePlayer(player) {
        return player === 'red' ? 'black' : 'red';
    }

    getCurrentPlayer() {
        return this.counter % 2 === 0 ? 'red' : 'black';
    }

    filterOut(all, currentPlayer) {
        const opposeSteps = this.getAvailableSteps(currentPlayer === 'black' ? 'red' : 'black');
        return all.filter(({ piece, to }) => {
            // 检查目标位置的棋子
            const [x, y, action] = to;

            const newGame = this.fork();
            const preRisks = newGame.getRisks(currentPlayer);
            console.log('before risks');
            console.log(preRisks);
            newGame.tryMove([piece.x, piece.y], [x, y]);
            const risks = newGame.getRisks(currentPlayer);
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

    autoMove() {
        if (this.gameOver) {
            return;
        }

        console.log('======================');
        // 随机走一步
        if (this.mode === 'L0') {
            const step = runL0(this);
            const {x, y} = step.piece;
            this.tryMove([x, y], step.to);
            return;
        }

        // 只看直接收益
        if (this.mode === 'L1') {
            this.L1(all);
            return;
        }

        // 看间接收益
        if (this.mode === 'L2') {
            this.L2(all);
            return;
        }

        // 看直接收益和间接收益
        if (this.mode === 'L3') {
            this.L3(all);
            return;
        }

        // 基于风险推断
        if (this.mode === 'L4') {
            this.L4(all);
            return;
        }

        // 通过虚拟棋盘执行后反推风险
        if (this.mode === 'L5') {
            const step = runL5(this);
            const {x, y} = step.piece;
            this.tryMove([x, y], step.to);
            return;
        }
    }

    getResistPoints(attacker, victim) {
        const { piece, to } = attacker;
        if (piece.role === 'che') {
            return this.getSteps(piece.role, piece.player, piece.x, piece.y).filter((d) => {
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
            return this.getSteps(piece.role, piece.player, piece.x, piece.y).filter((d) => {
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

    move(record) {
        const [displayName, start, direction, end] = record.split('');
        const role = getRoleByName(displayName);
        if (this.counter % 2 === 0) {
            const player = 'red';
            // 红方走
            const find = this.pieces.find((item) => {
                return (item.role === role && item.player === player && getPosition(start) === item.x);
            });
            if (!find) {
                throw new Error(`${record} not found`);
            }
            if (direction === '平') {
                find.x = getPosition(end);
            } else if (direction === '进') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        find.y = find.y - 1;
                    } else {
                        find.y = find.y - 2;
                    }
                    find.x = getPosition(end);
                } else if (role === 'xiang') {
                    find.x = getPosition(end);
                    find.y = find.y - 2;
                } else if (role === 'shi') {
                    find.x = getPosition(end);
                    find.y = find.y - 1;
                } else {
                    find.y = find.y - getDistance(end);
                }
            } else if (direction === '退') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        find.y = find.y + 1;
                    } else {
                        find.y = find.y + 2;
                    }
                    find.x = getPosition(end);
                } else if (role === 'xiang') {
                    find.y = find.y + 2;
                    find.x = getPosition(end);
                } else if (role === 'shi') {
                    find.x = getPosition(end);
                    find.y = find.y + 1;
                } else {
                    find.y = find.y + getDistance(end);
                }
            } else {
                throw new Error(`${record} not found`);
            }

            const blackPieceIndex = this.pieces.findIndex((item) => {
                return (item.player === 'black' && item.x === find.x && item.y === find.y);
            });
            if (blackPieceIndex !== -1) {
                console.log('发生吃兵');
                this.pieces.splice(blackPieceIndex, 1);
            }
        } else {
            // 黑方走
            const player = 'black';
            const find = this.pieces.find((item) => {
                return (item.role === role && item.player === player && getPosition(start) === item.x);
            });
            if (!find) {
                throw new Error(`${record} not found`);
            }
            if (direction === '进') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        find.y = find.y + 1;
                    } else {
                        find.y = find.y + 2;
                    }
                    find.x = getPosition(end);
                } else if (role === 'xiang') {
                    find.y = find.y + 2;
                    find.x = getPosition(end);
                } else if (role === 'shi') {
                    find.x = getPosition(end);
                    find.y = find.y + 1;
                } else {
                    find.y = find.y + Number(end);
                }
            } else if (direction === '退') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        find.y = find.y - 1;
                    } else {
                        find.y = find.y - 2;
                    }
                    find.x = getPosition(end);
                } else if (role === 'xiang') {
                    find.y = find.y - 2;
                    find.x = getPosition(end);
                } else if (role === 'shi') {
                    find.x = getPosition(end);
                    find.y = find.y - 1;
                } else {
                    find.y = find.y - Number(end);
                }
            } else if (direction === '平') {
                find.x = getPosition(end);
            }

            const redPieceIndex = this.pieces.findIndex((item) => {
                return (item.player === 'red' && item.x === find.x && item.y === find.y);
            });
            if (redPieceIndex !== -1) {
                console.log('发生吃兵');
                this.pieces.splice(redPieceIndex, 1);
            }
        }

        this.counter++;
    }

    detect(steps, player, x, y) {
        const find = this.find(x, y);
        if (find) {
            // 有己方单位
            if (find.player === player) {
                steps.push([x, y, 'protect']);
            } else {
                steps.push([x, y, 'eat']);
            }
            return;
        }

        if (x < 0 || x > 8) {
            return;
        }

        if (y < 0 || y > 9) {
            return;
        }

        steps.push([x, y, 'eat']);
    }

    static getWeight(find) {
        if (!find) {
            return 0;
        }

        const role = find.role;
        if (role === 'che') {
            return 5000;
        } else if (role === 'ma') {
            return 3000;
        } else if (role === 'xiang') {
            return 1000;
        } else if (role === 'shi') {
            return 1000;
        } else if (role === 'wang') {
            return 10000;
        } else if (role === 'pao') {
            return 3000;
        } else if (role === 'bing') {
            return 500;
        }
    }

    getSteps(role, player, x, y) {
        let steps = [];

        if (role === 'che') {
            // 4个方向
            // up
            for (let i = x + 1; i < 9; i++) {
                const point = [i, y];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([...point, 'eat']);
                    } else {
                        steps.push([...point, 'protect']);
                    }
                    break;
                }

                steps.push([...point, 'eat']);
            }

            // right
            for (let i = y + 1; i < 10; i++) {
                const point = [x, i];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([...point, 'eat']);
                    } else {
                        steps.push([...point, 'protect']);
                    }
                    break;
                }

                steps.push([...point, 'eat']);
            }

            // down
            for (let i = x - 1; i >= 0; i--) {
                const point = [i, y];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([...point, 'eat']);
                    } else {
                        steps.push([...point, 'protect']);
                    }
                    break;
                }

                steps.push([...point, 'eat']);
            }

            // left
            for (let i = y - 1; i >= 0; i--) {
                const point = [x, i];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([...point, 'eat']);
                    } else {
                        steps.push([...point, 'protect']);
                    }
                    break;
                }

                steps.push([...point, 'eat']);
            }

            return steps;
        } else if (role === 'ma') {
            const nearUp = this.find(x, y - 1);
            if (!nearUp) {
                this.detect(steps, player, x - 1, y - 2);
                this.detect(steps, player, x + 1, y - 2);
            }

            const nearRight = this.find(x + 1, y);
            if (!nearRight) {
                this.detect(steps, player, x + 2, y - 1);
                this.detect(steps, player, x + 2, y + 1);
            }

            const nearDown = this.find(x, y + 1);
            if (!nearDown) {
                this.detect(steps, player, x - 1, y + 2);
                this.detect(steps, player, x + 1, y + 2);
            }

            const nearLeft = this.find(x - 1, y);
            if (!nearLeft) {
                this.detect(steps, player, x - 2, y - 1);
                this.detect(steps, player, x - 2, y + 1);
            }

            return steps;
        } else if (role === 'xiang') {
            if (!this.find(x + 1, y - 1)) {
                this.detect(steps, player, x + 2, y - 2);
            }

            if (!this.find(x + 1, y + 1)) {
                this.detect(steps, player, x + 2, y + 2);
            }

            if (!this.find(x - 1, y + 1)) {
                this.detect(steps, player, x - 2, y + 2);
            }

            if (!this.find(x - 1, y - 1)) {
                this.detect(steps, player, x - 2, y - 2);
            }

            // 象不可过河
            return steps.filter((item) => {
                const [_, y] = item;
                if (player === 'red') {
                    return y > 4;
                } else {
                    return y < 5;
                }
            });
        } else if (role === 'shi') {
            this.detect(steps, player, x - 1, y - 1);
            this.detect(steps, player, x - 1, y + 1);
            this.detect(steps, player, x + 1, y - 1);
            this.detect(steps, player, x + 1, y + 1);

            // 士不出城
            return steps.filter((item) => {
                const [x, y] = item;
                if (x < 3 || x > 5) {
                    return false;
                }

                if (player === 'red') {
                    if (y < 7 || y > 9) {
                        return false;
                    }
                } else {
                    if (y < 0 || y > 2) {
                        return false;
                    }
                }

                return true;
            });
        } else if (role === 'wang') {
            // 4个方向
            this.detect(steps, player, x, y - 1);
            this.detect(steps, player, x + 1, y);
            this.detect(steps, player, x, y + 1);
            this.detect(steps, player, x - 1, y);

            // 王不出城
            steps = steps.filter((item) => {
                const [x, y] = item;
                if (x < 3 || x > 5) {
                    return false;
                }

                if (player === 'red') {
                    if (y < 7 || y > 9) {
                        return false;
                    }
                } else {
                    if (y < 0 || y > 2) {
                        return false;
                    }
                }

                return true;
            });

            // 王对王
            if (player === 'red') {
                for (let i = y - 1; i >= 0; i--) {
                    const point = [x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        if (f.player !== player && f.role === 'wang') {
                            // 找到对方王，添加点
                            steps.push([...point, 'eat']);
                        }
                        break;
                    }
                }
            } else {
                for (let i = y + 1; i < 10; i++) {
                    const point = [x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        if (f.player !== player && f.role === 'wang') {
                            // 找到对方王，添加点
                            steps.push([...point, 'eat']);
                        }
                        break;
                    }
                }
            }

            return steps;
        } else if (role === 'pao') {
            // 4个方向

            // up
            {
                let condition = null;
                let i;
                for (i = y - 1; i >= 0; i--) {
                    const point = [x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([...point, 'move']);
                }

                // 炮翻山检查
                if (condition) {
                    for (i = i - 1; i >= 0; i--) {
                        const point = [x, i];
                        const f = this.find(point[0], point[1]);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([...point, 'eat', condition]);
                            }
                            break;
                        }
                    }
                }
            }

            // right
            {
                let condition = null;
                let i;
                for (i = x + 1; i < 9; i++) {
                    const point = [i, y];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([...point, 'move']);
                }

                // 炮翻山检查
                if (condition) {
                    for (i = i + 1; i < 9; i++) {
                        const point = [i, y];
                        const f = this.find(point[0], point[1]);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([...point, 'eat', condition]);
                            }
                            break;
                        }
                    }
                }
            }

            // down
            {
                let condition = null;
                let i;

                for (i = y + 1; i < 10; i++) {
                    const point = [x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([...point, 'move']);
                }

                if (condition) {
                    for (i = i + 1; i < 10; i++) {
                        const point = [x, i];
                        const f = this.find(point[0], point[1]);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([...point, 'eat', condition]);
                            }
                            break;
                        }
                    }
                }
            }

            // left
            {
                let condition = null;
                let i;

                for (i = x - 1; i >= 0; i--) {
                    const point = [i, y];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([...point, 'move']);
                }

                if (condition) {
                    for (i = i - 1; i >= 0; i--) {
                        const point = [i, y];
                        const f = this.find(point[0], point[1]);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([...point, 'eat', condition]);
                            }
                            break;
                        }
                    }
                }
            }

            return steps;
        } else if (role === 'bing') {
            if (player === 'red') {
                this.detect(steps, player, x, y - 1);
                if (y < 5) {
                    this.detect(steps, player, x - 1, y);
                    this.detect(steps, player, x + 1, y);
                }
            } else {
                this.detect(steps, player, x, y + 1);
                if (y > 4) {
                    this.detect(steps, player, x - 1, y);
                    this.detect(steps, player, x + 1, y);
                }
            }
            return steps;
        }
    }
}
