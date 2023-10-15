import Piece from "./piece.js";
import Record from "./record.js";

export default class Game {
    constructor(options = {
        simulate: false
    }) {
        this.pieces = [];
        this.records = [];
        this.counter = 0;
        this.gameOver = false;
        // 记录上一步被吃的棋子
        this.eated = null;
        this.simulate = options.simulate;
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
     * 根据棋手获取棋盘上所有的存量棋子
     * @param {String} player 
     * @returns {Piece[]}
     */
    getPieces(player) {
        return this.pieces.filter((item) => {
            return item.player === player;
        });
    }

    /**
     * 复制一个棋局
     * @returns 一个复制的棋局
     */
    fork() {
        const game = new Game({
            simulate: true
        });
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

    /**
     * 获取当前轮次的棋手
     * @returns {String}
     */
    getCurrentPlayer() {
        return this.counter % 2 === 0 ? 'red' : 'black';
    }

    /**
     * 获取反方棋手
     * @param {String} player 
     * @returns 
     */
    static getOpposePlayer(player) {
        return player === 'red' ? 'black' : 'red';
    }

    /**
     * 给定棋子，给出所有可行的步骤
     * - 一般棋子，能到达的地方就是可以吃棋的地方
     * - 炮比较特别，没炮台的情况下，可以移动。有炮台时，可以越过炮台吃棋
     * @param {String} player 
     * @param {String} role 
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    getSteps(player, role, x, y) {
        let steps = [];

        if (role === 'che') {
            // 4个方向
            // up
            for (let i = y - 1; i >= 0; i--) {
                const [newX, newY] = [x, i];
                const f = this.find(newX, newY);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([newX, newY, 'eat']);
                    } else {
                        steps.push([newX, newY, 'protect']);
                    }
                    break;
                }

                steps.push([newX, newY, 'eat']);
            }

            // right
            for (let i = x + 1; i < 9; i++) {
                const [newX, newY] = [i, y];
                const f = this.find(newX, newY);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([newX, newY, 'eat']);
                    } else {
                        steps.push([newX, newY, 'protect']);
                    }
                    break;
                }

                steps.push([newX, newY, 'eat']);
            }

            // down
            for (let i = y + 1; i < 10; i++) {
                const [newX, newY] = [x, i];
                const f = this.find(newX, newY);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([newX, newY, 'eat']);
                    } else {
                        steps.push([newX, newY, 'protect']);
                    }
                    break;
                }

                steps.push([newX, newY, 'eat']);
            }

            // left
            for (let i = x - 1; i >= 0; i--) {
                const [newX, newY] = [i, y];
                const f = this.find(newX, newY);
                if (f) {
                    if (f.player !== player) {
                        // 找到对方棋子，添加点
                        steps.push([newX, newY, 'eat']);
                    } else {
                        steps.push([newX, newY, 'protect']);
                    }
                    break;
                }

                steps.push([newX, newY, 'eat']);
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
            this.detect(steps, player, x + 1, y - 1);
            this.detect(steps, player, x + 1, y + 1);
            this.detect(steps, player, x - 1, y + 1);
            this.detect(steps, player, x - 1, y - 1);

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
                    const [newX, newY] = [x, i];
                    const f = this.find(newX, newY);
                    if (f) {
                        if (f.player !== player && f.role === 'wang') {
                            // 找到对方王，添加点
                            steps.push([newX, newY, 'eat']);
                        }
                        break;
                    }
                }
            } else {
                for (let i = y + 1; i < 10; i++) {
                    const [newX, newY] = [x, i];
                    const f = this.find(newX, newY);
                    if (f) {
                        if (f.player !== player && f.role === 'wang') {
                            // 找到对方王，添加点
                            steps.push([newX, newY, 'eat']);
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
                    const [newX, newY] = [x, i];
                    const f = this.find(newX, newY);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([newX, newY, 'move']);
                }

                // 炮翻山检查
                if (condition) {
                    for (i = i - 1; i >= 0; i--) {
                        const [newX, newY] = [x, i];
                        const f = this.find(newX, newY);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([newX, newY, 'eat']);
                            } else {
                                steps.push([newX, newY, 'protect']);
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
                    const [newX, newY] = [i, y];
                    const f = this.find(newX, newY);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([newX, newY, 'move']);
                }

                // 炮翻山检查
                if (condition) {
                    for (i = i + 1; i < 9; i++) {
                        const [newX, newY] = [i, y];
                        const f = this.find(newX, newY);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([newX, newY, 'eat']);
                            } else {
                                steps.push([newX, newY, 'protect']);
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
                    const [newX, newY] = [x, i];
                    const f = this.find(newX, newY);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([newX, newY, 'move']);
                }

                if (condition) {
                    for (i = i + 1; i < 10; i++) {
                        const [newX, newY] = [x, i];
                        const f = this.find(newX, newY);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([newX, newY, 'eat']);
                            } else {
                                steps.push([newX, newY, 'protect']);
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
                    const [newX, newY] = [i, y];
                    const f = this.find(newX, newY);
                    if (f) {
                        condition = f;
                        break;
                    }

                    steps.push([newX, newY, 'move']);
                }

                if (condition) {
                    for (i = i - 1; i >= 0; i--) {
                        const [newX, newY] = [i, y];
                        const f = this.find(newX, newY);
                        if (f) {
                            if (f.player !== player) {
                                steps.push([newX, newY, 'eat']);
                            } else {
                                steps.push([newX, newY, 'protect']);
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

    /**
     * 获取所有可移动，吃子的步骤
     * @param {*} player 
     * @returns 
     */
    getCandidateSteps(player) {
        const steps = this.getAvailableSteps(player);
        return steps.filter((item) => {
            return item.to[2] !== 'protect';
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
            const steps = this.getSteps(item.player, item.role, item.x, item.y).map((step) => {
                return {
                    piece: item,
                    to: step
                };
            });
            pre.push(...steps);
            return pre;
        }, []);
    }

    tryMove(from, to) {
        if (this.gameOver) {
            return false;
        }

        const [oldX, oldY] = from;
        const [newX, newY] = to;
        if (!this.simulate) {
            console.log(`from (${oldX}, ${oldY}) to (${newX}, ${newY})`);
        }

        const find = this.find(oldX, oldY);
        if (!find) {
            console.log(`无可移动棋子`);
            return false;
        }

        if (!this.simulate) { // 模拟时不做轮次判断
            if (this.counter % 2 === 0 && find.player !== 'red') {
                console.log(`红方轮次，仅可移动红棋`);
                return false;
            }

            if (this.counter % 2 === 1 && find.player !== 'black') {
                console.log(`黑方轮次，仅可移动黑棋`);
                return false;
            }
        }

        const target = this.find(newX, newY);

        // 目标位置有我方棋子
        if (target && target.player === find.player) {
            console.log(`目标为我方棋子`);
            return false;
        }

        const steps = this.getSteps(find.player, find.role, oldX, oldY);
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
            if (!this.simulate) {
                console.log('发生吃兵');
            }

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
        if (!this.simulate) {
            console.log(`${find.player} ${find.role}(${oldX}, ${oldY}) to (${newX}, ${newY})`);
        }
        this.counter++;
        return true;
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

}
