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

}

class Game {
    constructor() {
        /**
         * @property {Piece}
         */
        this.pieces = [];
        this.records = [];
        this.moveCounter = 0;
        this.gameOver = false;
    }

    putPiece(piece) {
        this.pieces.push(piece);
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
        const [oldX, oldY] = from;
        const [newX, newY] = to;

        const find = this.find(oldX, oldY);

        if (!find) {
            return false;
        }

        const target = this.find(newX, newY);

        // 目标位置有我方棋子
        if (target && target.player === find.player) {
            return false;
        }

        const steps = this.getAvailableSteps(oldX, oldY);
        const step = steps.find((item) => {
            const [x, y] = item;
            return x === newX && y === newY;
        });

        if (!step) {
            return false;
        }

        const index = this.pieces.findIndex((item) => {
            return (item.player !== find.player && item.x === newX && item.y === newY);
        });

        if (index !== -1) {
            console.log('发生吃兵');
            this.pieces.splice(index, 1);

            if (target.role === 'wang') {
                this.gameOver = true;
            }
        }

        this.records.push(Game.makeStep(find, newX, newY));
        // TODO: check rule
        find.x = newX;
        find.y = newY;

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

    selectStep(steps) {
        const index = Math.floor(Math.random() * steps.length);
        const step = steps[index];
        this.tryMove([step.piece.x, step.piece.y], step.to);
    }

    autoMove() {
        if (this.gameOver) {
            return;
        }

        if (this.moveCounter % 2 === 0) {
            const player = 'red';
            const redPieces = this.pieces.filter((item) => {
                return item.player === player;
            });
            const all = redPieces.reduceRight((pre, item) => {
                const steps = this.getAvailableSteps(item.x, item.y).map((step) => {
                    return {
                        piece: item,
                        to: step
                    };
                });
                pre.push(...steps);
                return pre;
            }, []);
            this.selectStep(all);
        } else {
            const player = 'black';
            const redPieces = this.pieces.filter((item) => {
                return item.player === player;
            });
            const all = redPieces.reduceRight((pre, item) => {
                const steps = this.getAvailableSteps(item.x, item.y).map((step) => {
                    return {
                        piece: item,
                        to: step
                    };
                });
                pre.push(...steps);
                return pre;
            }, []);
            this.selectStep(all);
        }
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
        if (find && find.player === player) {
            return;
        }

        if (x < 0 || x > 8) {
            return;
        }

        if (y < 0 || y > 9) {
            return;
        }

        steps.push([x, y]);
    }

    getAvailableSteps(x, y) {
        let steps = [];
        const find = this.find(x, y);

        if (!find) {
            return steps;
        }

        if (find.role === 'che') {
            // 4个方向
            // up
            for (let i = find.x + 1; i < 9; i++) {
                const point = [i, find.y];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== find.player) {
                        // 找到对方棋子，添加点
                        steps.push(point);
                    }
                    break;
                }

                steps.push(point);
            }

            // right
            for (let i = find.y + 1; i < 10; i++) {
                const point = [find.x, i];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== find.player) {
                        // 找到对方棋子，添加点，但终止
                        steps.push(point);
                    }
                    break;
                }

                steps.push(point);
            }

            for (let i = find.x - 1; i >= 0; i--) {
                const point = [i, find.y];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== find.player) {
                        // 找到对方棋子，添加点，但终止
                        steps.push(point);
                    }
                    break;
                }

                steps.push(point);
            }

            for (let i = find.y - 1; i >= 0; i--) {
                const point = [find.x, i];
                const f = this.find(point[0], point[1]);
                if (f) {
                    if (f.player !== find.player) {
                        // 找到对方棋子，添加点，但终止
                        steps.push(point);
                    }
                    break;
                }

                steps.push(point);
            }

            return steps;
        } else if (find.role === 'ma') {
            const nearUp = this.find(x, y - 1);
            if (!nearUp) {
                this.detect(steps, find.player, x - 1, y - 2);
                this.detect(steps, find.player, x + 1, y - 2);
            }

            const nearRight = this.find(x + 1, y);
            if (!nearRight) {
                this.detect(steps, find.player, x + 2, y - 1);
                this.detect(steps, find.player, x + 2, y + 1);
            }

            const nearDown = this.find(x, y + 1);
            if (!nearDown) {
                this.detect(steps, find.player, x - 1, y + 2);
                this.detect(steps, find.player, x + 1, y + 2);
            }

            const nearLeft = this.find(x - 1, y);
            if (!nearLeft) {
                this.detect(steps, find.player, x - 2, y - 1);
                this.detect(steps, find.player, x - 2, y + 1);
            }

            return steps;
        } else if (find.role === 'xiang') {
            if (!this.find(x + 1, y - 1)) {
                this.detect(steps, find.player, x + 2, y - 2);
            }

            if (!this.find(x + 1, y + 1)) {
                this.detect(steps, find.player, x + 2, y + 2);
            }

            if (!this.find(x - 1, y + 1)) {
                this.detect(steps, find.player, x - 2, y + 2);
            }

            if (!this.find(x - 1, y - 1)) {
                this.detect(steps, find.player, x - 2, y - 2);
            }

            // 象不可过河
            return steps.filter((item) => {
                const [_, y] = item;
                if (find.player === 'red') {
                    return y > 4;
                } else {
                    return y < 5;
                }
            });
        } else if (find.role === 'shi') {
            this.detect(steps, find.player, x - 1, y - 1);
            this.detect(steps, find.player, x - 1, y + 1);
            this.detect(steps, find.player, x + 1, y - 1);
            this.detect(steps, find.player, x + 1, y + 1);

            // 士不出城
            return steps.filter((item) => {
                const [x, y] = item;
                if (x < 3 || x > 5) {
                    return false;
                }

                if (find.player === 'red') {
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
        } else if (find.role === 'wang') {
            // 4个方向
            this.detect(steps, find.player, x, y - 1);
            this.detect(steps, find.player, x + 1, y);
            this.detect(steps, find.player, x, y + 1);
            this.detect(steps, find.player, x - 1, y);

            // 王不出城
            steps = steps.filter((item) => {
                const [x, y] = item;
                if (x < 3 || x > 5) {
                    return false;
                }

                if (find.player === 'red') {
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
            if (find.player === 'red') {
                for (let i = find.y - 1; i >= 0; i--) {
                    const point = [find.x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        if (f.player !== find.player && f.role === 'wang') {
                            // 找到对方王，添加点
                            steps.push(point);
                        }
                        break;
                    }
                }
            } else {
                for (let i = find.y + 1; i < 10; i++) {
                    const point = [find.x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        if (f.player !== find.player && f.role === 'wang') {
                            // 找到对方王，添加点
                            steps.push(point);
                        }
                        break;
                    }
                }
            }

            return steps;
        } else if (find.role === 'pao') {
            // 4个方向

            // up
            {
                let has = false;
                let i;
                for (i = find.y - 1; i >= 0; i--) {
                    const point = [find.x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        has = true;
                        break;
                    }

                    steps.push(point);
                }

                // 炮翻山检查
                if (has) {
                    for (i = i - 1; i >= 0; i--) {
                        const point = [find.x, i];
                        const f = this.find(point[0], point[1]);
                        if (f) {
                            if (f.player !== find.player) {
                                steps.push(point);
                            }
                            break;
                        }
                    }
                }
            }

            // right
            {
                let has = false;
                let i;
                for (i = find.x + 1; i < 9; i++) {
                    const point = [i, find.y];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        has = true;
                        break;
                    }

                    steps.push(point);
                }

                // 炮翻山检查
                if (has) {
                    for (i = i + 1; i < 9; i++) {
                        const point = [i, find.y];
                        const f = this.find(point[0], point[1]);
                        if (f) {
                            if (f.player !== find.player) {
                                steps.push(point);
                            }
                            break;
                        }
                    }
                }
            }

            // down
            {
                let has = false;
                let i;

                for (i = find.y + 1; i < 10; i++) {
                    const point = [find.x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        has = true;
                        break;
                    }

                    steps.push(point);
                }

                for (i = i + 1; i < 10; i++) {
                    const point = [find.x, i];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        if (f.player !== find.player) {
                            steps.push(point);
                        }
                        break;
                    }
                }
            }

            // left
            {
                let has = false;
                let i;

                for (i = find.x - 1; i >= 0; i--) {
                    const point = [i, find.y];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        has = true;
                        break;
                    }

                    steps.push(point);
                }

                for (i = i - 1; i >= 0; i--) {
                    const point = [i, find.y];
                    const f = this.find(point[0], point[1]);
                    if (f) {
                        if (f.player !== find.player) {
                            steps.push(point);
                        }
                        break;
                    }
                }
            }

            return steps;
        } else if (find.role === 'bing') {
            if (find.player === 'red') {
                this.detect(steps, find.player, x, y - 1);
                if (y < 5) {
                    this.detect(steps, find.player, x - 1, y);
                    this.detect(steps, find.player, x + 1, y);
                }
            } else {
                this.detect(steps, find.player, x, y + 1);
                if (y > 4) {
                    this.detect(steps, find.player, x - 1, y);
                    this.detect(steps, find.player, x + 1, y);
                }
            }
            return steps;
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const canvas = document.querySelector('#main');
const game = new Game(canvas);
game.initGame();

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
        size: 60,
        offsetX: 30,
        offsetY: 30,
        fontSize: '40px',
        // 红色方棋子颜色
        redPlayerColor: 'red',
        // 黑色方棋子
        blackPlayerColor: 'black',
        pieceColor: '#bcd0fa',
        // 棋子半径
        radus: 28
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
                this.selected = [x, y];
            } else {
                this.selected = null;
            }
        }
    }

    displayAvailableSteps(x, y) {
        const steps = this.game.getAvailableSteps(x, y);
        if (steps) {
            for (const [x, y] of steps) {
                this.drawStep(x, y);
            }
        }
    }

    drawStep(x, y) {
        const { size, color, radus, offsetX, offsetY } = this.props;
        const ctx = this.ctx;

        // 第二象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radus, y * size + offsetY - radus + 10);
        ctx.lineTo(x * size + offsetX - radus, y * size + offsetY - radus);
        ctx.lineTo(x * size + offsetX - radus + 10, y * size + offsetY - radus);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第三象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radus, y * size + offsetY + radus - 10);
        ctx.lineTo(x * size + offsetX - radus, y * size + offsetY + radus);
        ctx.lineTo(x * size + offsetX - radus + 10, y * size + offsetY + radus);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第一象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radus - 10, y * size + offsetY - radus);
        ctx.lineTo(x * size + offsetX + radus, y * size + offsetY - radus);
        ctx.lineTo(x * size + offsetX + radus, y * size + offsetY - radus + 10);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第四象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radus, y * size + offsetY + radus - 10);
        ctx.lineTo(x * size + offsetX + radus, y * size + offsetY + radus);
        ctx.lineTo(x * size + offsetX + radus - 10, y * size + offsetY + radus);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawSelect(x, y) {
        if (x > 8) {
            return;
        }

        if (y > 9) {
            return;
        }

        const { size, color, radus, offsetX, offsetY } = this.props;
        const ctx = this.ctx;

        // 第二象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radus, y * size + offsetY - radus + 10);
        ctx.lineTo(x * size + offsetX - radus, y * size + offsetY - radus);
        ctx.lineTo(x * size + offsetX - radus + 10, y * size + offsetY - radus);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第三象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX - radus, y * size + offsetY + radus - 10);
        ctx.lineTo(x * size + offsetX - radus, y * size + offsetY + radus);
        ctx.lineTo(x * size + offsetX - radus + 10, y * size + offsetY + radus);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第一象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radus - 10, y * size + offsetY - radus);
        ctx.lineTo(x * size + offsetX + radus, y * size + offsetY - radus);
        ctx.lineTo(x * size + offsetX + radus, y * size + offsetY - radus + 10);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 第四象限
        ctx.beginPath();
        ctx.moveTo(x * size + offsetX + radus, y * size + offsetY + radus - 10);
        ctx.lineTo(x * size + offsetX + radus, y * size + offsetY + radus);
        ctx.lineTo(x * size + offsetX + radus - 10, y * size + offsetY + radus);
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
        const { size, radus, pieceColor, offsetX, offsetY, fontSize } = this.props;

        const ctx = this.ctx;
        // 绘制棋格
        ctx.beginPath()
        ctx.moveTo(x * size + offsetX, y * size + offsetY);
        ctx.arc(x * size + offsetX, y * size + offsetY, radus, 0, 2 * Math.PI);
        ctx.strokeStyle = this.getColor(piece);
        ctx.stroke();

        ctx.moveTo(x * size + offsetX, y * size + offsetY);
        ctx.arc(x * size + offsetX, y * size + offsetY, radus, 0, 2 * Math.PI);
        ctx.fillStyle = pieceColor;
        ctx.fill();
        ctx.closePath();

        // 绘制棋子
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

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        this.clear();
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

const render = new GameRender(document.querySelector('#main'), game);
render.render();

// async function run() {
//     while (true) {
//         await render.moveRed();
//         await sleep(1000);
//         render.move();
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
