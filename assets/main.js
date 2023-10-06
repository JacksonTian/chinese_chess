'use strict';

const positionMap = {
    // 红方坐标系
    '一': 8,
    '二': 7,
    '三': 6,
    '四': 5,
    '五': 4,
    '六': 3,
    '七': 2,
    '八': 1,
    '九': 0,
    // 黑方坐标系
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
}

const getXforRed = function (x) {
    switch (x) {
        case 0:
            return '九';
        case 1:
            return '八'
        case 2:
            return '七'
        case 3:
            return '六'
        case 4:
            return '五'
        case 5:
            return '四'
        case 6:
            return '三'
        case 7:
            return '二'
        case 8:
            return '一'
    }
}

const getXforBlack = function (x) {
    switch (x) {
        case 0:
            return '1';
        case 1:
            return '2'
        case 2:
            return '3'
        case 3:
            return '4'
        case 4:
            return '5'
        case 5:
            return '6'
        case 6:
            return '7'
        case 7:
            return '8'
        case 8:
            return '9'
    }
}

const distance = {
    '一': 1,
    '二': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
    '七': 7,
    '八': 8,
    '九': 9,
};

function getPosition(number) {
    return positionMap[number];
}

class Piece {
    /**
     * 
     * @param {String} role 
     * @param {String} player red or black
     */
    constructor(role, player, x, y) {
        this.role = role;
        this.player = player;
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.player}/${this.role}(${this.x}, ${this.y})`;
    }

}

class Game {
    constructor(options = {
        mode: 'L0'
    }) {
        /**
         * @property {Piece}
         */
        this.pieces = [];
        this.records = [];
        this.moveCounter = 0;
        this.gameOver = false;
        this.mode = options.mode;
        // 记录上一步被吃的棋子
        this.eated = null;
    }

    putPiece(piece) {
        this.pieces.push(piece);
    }

    fork(deleted) {
        const game = new Game();

        for (const p of this.pieces) {
            if (deleted && p.role === deleted.role && p.player === deleted.player && p.x === deleted.x && p.y === deleted.y) {
                continue;
            }
            game.putPiece(new Piece(p.role, p.player, p.x, p.y));
        }
        game.moveCounter = this.moveCounter;

        return game;
    }

    initGame() {
        // for black player
        this.putPiece(new Piece('che', 'black', 0, 0));
        this.putPiece(new Piece('che', 'black', 8, 0));
        this.putPiece(new Piece('ma', 'black', 1, 0));
        this.putPiece(new Piece('ma', 'black', 7, 0));
        this.putPiece(new Piece('xiang', 'black', 2, 0));
        this.putPiece(new Piece('xiang', 'black', 6, 0));
        this.putPiece(new Piece('shi', 'black', 3, 0));
        this.putPiece(new Piece('shi', 'black', 5, 0));
        this.putPiece(new Piece('wang', 'black', 4, 0));
        this.putPiece(new Piece('pao', 'black', 1, 2));
        this.putPiece(new Piece('pao', 'black', 7, 2));
        this.putPiece(new Piece('bing', 'black', 0, 3));
        this.putPiece(new Piece('bing', 'black', 2, 3));
        this.putPiece(new Piece('bing', 'black', 4, 3));
        this.putPiece(new Piece('bing', 'black', 6, 3));
        this.putPiece(new Piece('bing', 'black', 8, 3));
        // for red player
        this.putPiece(new Piece('che', 'red', 0, 9));
        this.putPiece(new Piece('che', 'red', 8, 9));
        this.putPiece(new Piece('ma', 'red', 1, 9));
        this.putPiece(new Piece('ma', 'red', 7, 9));
        this.putPiece(new Piece('xiang', 'red', 2, 9));
        this.putPiece(new Piece('xiang', 'red', 6, 9));
        this.putPiece(new Piece('shi', 'red', 3, 9));
        this.putPiece(new Piece('shi', 'red', 5, 9));
        this.putPiece(new Piece('wang', 'red', 4, 9));
        this.putPiece(new Piece('pao', 'red', 1, 7));
        this.putPiece(new Piece('pao', 'red', 7, 7));
        this.putPiece(new Piece('bing', 'red', 0, 6));
        this.putPiece(new Piece('bing', 'red', 2, 6));
        this.putPiece(new Piece('bing', 'red', 4, 6));
        this.putPiece(new Piece('bing', 'red', 6, 6));
        this.putPiece(new Piece('bing', 'red', 8, 6));
    }

    static getRoleByName(name) {
        const mapping = {
            '车': 'che',
            '马': 'ma',
            '相': 'xiang',
            '象': 'xiang',
            '士': 'shi',
            '仕': 'shi',
            '将': 'wang',
            '帅': 'wang',
            '炮': 'pao',
            '砲': 'pao',
            '兵': 'bing',
            '卒': 'bing'
        };
        return mapping[name];
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

        if (this.moveCounter % 2 === 0 && find.player !== 'red') {
            console.log(`非红方步骤`);
            return false;
        }

        if (this.moveCounter % 2 === 1 && find.player !== 'black') {
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
            return x === newX && y === newY && action !== 'protect';
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

        this.records.push(Game.makeStep(find, newX, newY));
        // TODO: check rule
        find.x = newX;
        find.y = newY;
        console.log(`${find.role}(${oldX}, ${oldY}) to (${newX}, ${newY})`);
        this.moveCounter++;
        return true;
    }

    static getName(piece) {
        const { role, player } = piece;
        const names = {
            'che': ['俥', '車'],
            'ma': ['傌', '馬'],
            'xiang': ['相', '象'],
            'shi': ['仕', '士'],
            'wang': ['帅', '将'],
            'bing': ['兵', '卒'],
            'pao': ['炮', '砲']
        }
        return names[role][player === 'red' ? 0 : 1];
    }

    static makeStep(find, newX, newY) {
        // 特殊记谱情况：https://www.zhihu.com/question/470070915/answer/2748414695
        const { player, role } = find;
        const name = Game.getName(find);
        let direction;
        let end;
        if (player === 'red') {
            if (find.y === newY) {
                direction = '平';
                end = getXforRed(newX);
            } else if (find.y > newY) {
                direction = '进';
                if (role === 'ma') {
                    end = getXforRed(newX);
                } else if (role === 'pao') {
                    end = Math.abs(newY - find.y);
                }
            } else {
                direction = '退';
                if (role === 'ma') {
                    end = getXforRed(newX);
                } else if (role === 'pao') {
                    end = Math.abs(newY - find.y);
                }
            }
            return `${name}${getXforRed(find.x)}${direction}${end}`;
        } else {
            return `${name}${getXforBlack(find.x)}${direction}${end}`;
        }
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
        const game = this.fork(new Piece(role, player, x, y));
        const steps = game.getSteps(role, player, x, y).filter((step) => {
            return step[2] !== 'protect' && step[2] !== 'will-eat';
        });
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
        return steps.filter((item) => {
            return item.to[2] !== 'protect' && item.to[2] !== 'will-eat';
        });
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

    static random(list) {
        const index = Math.floor(Math.random() * list.length);
        return list[index];
    }

    L0(all) {
        const step = Game.random(all);
        this.tryMove([step.piece.x, step.piece.y], step.to);
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
        const player = this.moveCounter % 2 === 0 ? 'red' : 'black';
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
    
    L5(all) {
        const player = this.moveCounter % 2 === 0 ? 'red' : 'black';
        const steps = all.map(({ piece, to }) => {
            // 检查目标位置的棋子
            const [x, y, action] = to;

            const newGame = this.fork();
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
                return false;
            }));

            return {
                piece,
                to,
                income,
                before,
                after
            };
        }).filter((d) => {
            if (d.after > d.before) {
                return false;
            }
            return true;
        });
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
        this.tryMove([step.piece.x, step.piece.y], step.to);
        return;
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
        const player = this.moveCounter % 2 === 0 ? 'red' : 'black';

        // 过滤移动后就被直接吃的步骤
        const all = this.getCandidateSteps(player);

        // 随机走一步
        if (this.mode === 'L0') {
            this.L0(all);
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
            this.L5(all);
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
        const role = Game.getRoleByName(displayName);
        if (this.moveCounter % 2 === 0) {
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
                    find.y = find.y - distance[end];
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
                    find.y = find.y + distance[end];
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

        this.moveCounter++;
    }

    find(x, y) {
        return this.pieces.find((item) => {
            return item.x === x && item.y === y;
        });
    }

    detect(steps, player, x, y) {
        const find = this.find(x, y);
        // 有己方单位
        if (find) {
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
                            } else {
                                steps.push([...point, 'protect', condition]);
                            }
                            break;
                        } else {
                            steps.push([...point, 'will-eat', condition]);
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
                            } else {
                                steps.push([...point, 'protect', condition]);
                            }
                            break;
                        } else {
                            steps.push([...point, 'will-eat', condition]);
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
                            } else {
                                steps.push([...point, 'protect', condition]);
                            }
                            break;
                        } else {
                            steps.push([...point, 'will-eat', condition]);
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
                            } else {
                                steps.push([...point, 'protect', condition]);
                            }
                            break;
                        } else {
                            steps.push([...point, 'will-eat', condition]);
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

class GameRender {
    /**
     * 
     * @param {HTMLElement} canvas 
     * @param {Game} game 
     * @param {*} props 
     */
    constructor(canvas, game, props = {
        lineWidth: 2,
        color: '#333',
        // 棋格大小
        size: 60,
        // 棋子半径
        radius: 25,
        offsetX: 30,
        offsetY: 30,
        fontSize: '40px',
        // 红色方棋子颜色
        redPlayerColor: 'red',
        // 黑色方棋子
        blackPlayerColor: 'black',
        // 棋子颜色
        pieceColor: '#fff'
    }) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.props = props;

        this.canvas.addEventListener('mousedown', (e) => {
            this.onMouseDown(e);
        });
        this.game = game;
        this.selected = null;
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        const { size, offsetX, offsetY } = this.props;
        const x = Math.floor((e.clientX - offsetX) / size);
        const y = Math.floor((e.clientY - offsetY) / size);
        this.render();
        this.drawSelect(x, y);
        this.displayAvailableSteps(x, y);

        if (this.selected && (this.selected[0] !== x || this.selected[1] !== y)) {
            const moved = this.game.tryMove(this.selected, [x, y]);
            this.selected = null;
            if (moved) {
                this.render();
                // 黑方自动走棋
                this.move();
            }
        } else {
            if (this.game.find(x, y)) {
                console.log(`selected ${x}, ${y}`);
                this.selected = [x, y];
            } else {
                this.selected = null;
            }
        }
    }

    displayAvailableSteps(x, y) {
        const find = this.game.find(x, y);
        if (!find) {
            return;
        }

        const opposeSteps = this.game.getAvailableSteps(find.player === 'red' ? 'black' : 'red');

        const steps = this.game.getSteps(find.role, find.player, find.x, find.y);
        for (const [x, y, action] of steps) {
            if (action !== 'protect' && action !== 'will-eat') {
                this.drawStep(x, y);
                if (opposeSteps.find((d) => {
                    const condition = d.to[3];
                    if (condition && condition.x === find.x && condition.y === find.y) {
                        // 炮的判断比较特别
                        return d.to[0] === x && d.to[1] === y && (d.to[2] != 'move' && d.to[2] !== 'will-eat');
                    } else {
                        return d.to[0] === x && d.to[1] === y && d.to[2] != 'move';
                    }
                })) {
                    this.drawWarningStep(x, y);
                }
            }
        }
    }

    drawWarningStep(x, y) {
        const { size, lineWidth, color, radius, offsetX, offsetY } = this.props;
        const ctx = this.ctx;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radius, y * size + offsetY - radius);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY + radius);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radius, y * size + offsetY + radius);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY - radius);
        ctx.stroke();
    }

    drawStep(x, y) {
        const { size, radius, offsetX, offsetY } = this.props;
        const ctx = this.ctx;

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'red';
        // 第二象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radius, y * size + offsetY - radius + 10);
        ctx.lineTo(x * size + offsetX - radius, y * size + offsetY - radius);
        ctx.lineTo(x * size + offsetX - radius + 10, y * size + offsetY - radius);
        ctx.stroke();

        // 第三象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radius, y * size + offsetY + radius - 10);
        ctx.lineTo(x * size + offsetX - radius, y * size + offsetY + radius);
        ctx.lineTo(x * size + offsetX - radius + 10, y * size + offsetY + radius);
        ctx.stroke();

        // 第一象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radius - 10, y * size + offsetY - radius);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY - radius);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY - radius + 10);
        ctx.stroke();

        // 第四象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radius, y * size + offsetY + radius - 10);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY + radius);
        ctx.lineTo(x * size + offsetX + radius - 10, y * size + offsetY + radius);
        ctx.stroke();
    }

    drawSelect(x, y) {
        if (x > 8) {
            return;
        }

        if (y > 9) {
            return;
        }

        const { size, color, radius, offsetX, offsetY } = this.props;
        const ctx = this.ctx;

        // 第二象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radius, y * size + offsetY - radius + 10);
        ctx.lineTo(x * size + offsetX - radius, y * size + offsetY - radius);
        ctx.lineTo(x * size + offsetX - radius + 10, y * size + offsetY - radius);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第三象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radius, y * size + offsetY + radius - 10);
        ctx.lineTo(x * size + offsetX - radius, y * size + offsetY + radius);
        ctx.lineTo(x * size + offsetX - radius + 10, y * size + offsetY + radius);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第一象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radius - 10, y * size + offsetY - radius);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY - radius);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY - radius + 10);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第四象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radius, y * size + offsetY + radius - 10);
        ctx.lineTo(x * size + offsetX + radius, y * size + offsetY + radius);
        ctx.lineTo(x * size + offsetX + radius - 10, y * size + offsetY + radius);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawLine(x, y, x2, y2) {
        const { size, lineWidth, color, offsetX, offsetY } = this.props;
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX, y * size + offsetY);
        ctx.lineTo(x2 * size + offsetX, y2 * size + offsetY);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    drawBoard() {
        // 清理画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制所有的横线
        for (let i = 0; i < 10; i++) {
            this.drawLine(0, i, 8, i)
        }

        // 绘制上下半区的 竖线
        for (let i = 0; i < 9; i++) {
            this.drawLine(i, 0, i, 4)
            this.drawLine(i, 5, i, 9)
        }

        // 补全楚河汉界 两边的线
        this.drawLine(0, 4, 0, 5);
        this.drawLine(8, 4, 8, 5);

        const ctx = this.ctx;
        const { size, fontSize, offsetX, offsetY } = this.props;
        ctx.fillStyle = 'black';
        ctx.font = `400 ${fontSize} 微软雅黑`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('楚河', 2 * size + offsetX, 4.5 * size + offsetY);
        ctx.fillText('汉界', 6 * size + offsetX, 4.5 * size + offsetY);

        // 补全boss所在区的斜线
        this.drawLine(3, 0, 5, 2);
        this.drawLine(5, 0, 3, 2);

        this.drawLine(3, 7, 5, 9);
        this.drawLine(5, 7, 3, 9);

        // 炮位置的修饰
        this.drawDecorate(1, 2);
        this.drawDecorate(7, 2);
        this.drawDecorate(1, 7);
        this.drawDecorate(7, 7);

        // 兵位置的修饰
        this.drawDecorate(0, 3);
        this.drawDecorate(2, 3);
        this.drawDecorate(4, 3);
        this.drawDecorate(6, 3);
        this.drawDecorate(8, 3);

        this.drawDecorate(0, 6);
        this.drawDecorate(2, 6);
        this.drawDecorate(4, 6);
        this.drawDecorate(6, 6);
        this.drawDecorate(8, 6);
    }

    drawDecorate(x, y) {
        const { size, color, offsetX, offsetY } = this.props;
        const ctx = this.ctx;

        if (x > 0) {
            // 第二象限
            ctx.beginPath();
            ctx.moveTo(x * size + offsetX - 15, y * size + offsetY - 5);
            ctx.lineTo(x * size + offsetX - 5, y * size + offsetY - 5);
            ctx.lineTo(x * size + offsetX - 5, y * size + offsetY - 15);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();

            // 第三象限
            ctx.beginPath();
            ctx.moveTo(x * size + offsetX - 15, y * size + offsetY + 5);
            ctx.lineTo(x * size + offsetX - 5, y * size + offsetY + 5);
            ctx.lineTo(x * size + offsetX - 5, y * size + offsetY + 15);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        if (x < 8) {
            // 第一象限
            ctx.beginPath();
            ctx.moveTo(x * size + offsetX + 5, y * size + offsetY - 15);
            ctx.lineTo(x * size + offsetX + 5, y * size + offsetY - 5);
            ctx.lineTo(x * size + offsetX + 15, y * size + offsetY - 5);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();

            // 第四象限
            ctx.beginPath();
            ctx.moveTo(x * size + offsetX + 5, y * size + offsetY + 15);
            ctx.lineTo(x * size + offsetX + 5, y * size + offsetY + 5);
            ctx.lineTo(x * size + offsetX + 15, y * size + offsetY + 5);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    // 绘制棋子函数
    drawPiece(piece) {
        const { x, y } = piece;
        const { size, radius, pieceColor, offsetX, offsetY, fontSize } = this.props;

        const ctx = this.ctx;
        // 绘制外圈
        ctx.beginPath()
        ctx.moveTo(x * size + offsetX, y * size + offsetY);
        ctx.arc(x * size + offsetX, y * size + offsetY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.getColor(piece);
        ctx.lineWidth = 5;
        ctx.stroke();

        // 绘制棋子
        ctx.moveTo(x * size + offsetX, y * size + offsetY);
        ctx.arc(x * size + offsetX, y * size + offsetY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = pieceColor;
        ctx.fill();
        ctx.closePath();

        // 绘制文字
        ctx.font = `400 ${fontSize} 微软雅黑`;
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = this.getColor(piece);
        const text = Game.getName(piece);
        ctx.fillText(text, x * size + offsetX, y * size + offsetY)
    }

    getColor(piece) {
        const { player } = piece;
        const { redPlayerColor, blackPlayerColor } = this.props;
        return player === 'red' ? redPlayerColor : blackPlayerColor;
    }

    render() {
        this.drawBoard();
        const pieces = this.game.pieces;
        for (const piece of pieces) {
            this.drawPiece(piece);
        }
    }

    async replay(records) {
        for (const record of records) {
            this.game.move(record);
            this.render();
            await sleep(1000);
        }
    }

    move() {
        this.game.autoMove();
        this.render();
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const game = new Game({ mode: 'L5' });
game.initGame();
// game.putPiece(new Piece('wang', 'black', 4, 0));
// game.putPiece(new Piece('wang', 'red', 4, 9));
// // game.putPiece(new Piece('xiang', 'black', 6, 0));
// // game.putPiece(new Piece('shi', 'black', 4, 1));
// game.putPiece(new Piece('pao', 'black', 7, 3));
// game.putPiece(new Piece('pao', 'red', 5, 4));

const render = new GameRender(document.querySelector('#main'), game);
render.render();

// async function run() {
//     while (!render.game.gameOver) {
//         render.move();
//         await sleep(1000);
//         render.move();
//         await sleep(1000);
//     }
// }

// run();

// const records = [
//     '相三进五', '炮2平6',
//     '兵七进一', '马2进3',
//     '炮八平六', '车1平2',
//     '马八进七', '马8进7',
//     '车九进一', '车2进4',
//     '马七进六', '卒7进1',
//     '车九平七', '象7进5',
//     '马二进四', '炮8进3',
//     '炮二平三', '车9平8',
//     '车一平二', '士6进5',
//     '车二进二', '炮6进1',
//     '炮三退二', '卒9进1',
//     '车二平四', '炮6平9',
//     '车四进四', '炮8退2',
//     '车四退二', '炮9进3',
//     '兵三进一', '炮8进2',
//     '兵三进一', '车2平7',
//     '炮三平二', '炮9进3',
//     '车四退二', '车8平6',
//     '车四平二', '车6进5',
//     '马六进七', '车7进4',
//     '车二平一'
// ];

// render.replay(records);
