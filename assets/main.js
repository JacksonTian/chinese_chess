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

        const find = this.pieces.find((item) => {
            return item.x === oldX && item.y === oldY;
        });

        if (!find) {
            return false;
        }

        const target = this.pieces.find((item) => {
            return item.x === newX && item.y === newY;
        });

        // 目标位置有我方棋子
        if (target && target.player === find.player) {
            return false;
        }

        if (newX === oldX && newY === oldY) {
            return false;
        }

        if (find.role === 'pao' || find.role === 'che') {
            if (newX !== oldX && newY !== oldY) {
                return false;
            }
        } else if (find.role === 'ma') {
            // 马走斜日
            if (Math.abs(newX - oldX) + Math.abs(newY - oldY) !== 3) {
                return false;
            }
            // 拐角马判断
        } else if (find.role === 'wang') {
            if (newX < 3 || newX > 5) {
                return false;
            }

            // 王不出城
            if (find.player === 'red') {
                if (newY < 7 || newY > 9) {
                    return false;
                }
            } else {
                if (newY < 0 || newY > 2) {
                    return false;
                }
            }

            // 王只能走一格
            if (Math.abs(newX - oldX) + Math.abs(newY - oldY) !== 1) {
                return false;
            }
        } else if (find.role === 'shi') {
            if (newX < 3 || newX > 5) {
                return false;
            }

            // 士不出城
            if (find.player === 'red') {
                if (newY < 7 || newY > 9) {
                    return false;
                }
            } else {
                if (newY < 0 || newY > 2) {
                    return false;
                }
            }

            // 士只能斜走
            if (Math.abs(newX - oldX) + Math.abs(newY - oldY) !== 2) {
                return false;
            }

            if (newX === oldX) {
                return false;
            }

            if (newY === oldY) {
                return false;
            }
        } else if (find.role === 'xiang') {
            // 象行田
            if (Math.abs(newX - oldX) !== 2) {
                return false;
            }

            if (Math.abs(newY - oldY) !== 2) {
                return false;
            }

            // 不能过河
            if (find.player === 'red') {
                if (newY < 5) {
                    return false;
                }
            } else {
                if (newY > 4) {
                    return false;
                }
            }
        } else if (find.role === 'bing') {
            // 兵只能走一格
            if (Math.abs(newX - oldX) + Math.abs(newY - oldY) !== 1) {
                return false;
            }

            if (find.player === 'red') {
                if (newY > 4) {
                    if (newX - oldX !== 0) {
                        return false;
                    }
                }
                // 不可后退
                if (newY > oldY) {
                    return false;
                }
            } else {
                if (newY < 5) {
                    if (newX - oldX !== 0) {
                        return false;
                    }
                }
                // 不可后退
                if (newY < oldY) {
                    return false;
                }
            }
        }

        // TODO: check rule
        find.x = newX;
        find.y = newY;
        return true;
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

    getAvailableSteps(x, y) {
        const steps = [];
        const find = this.find(x, y);

        if (!find) {
            return steps;
        }

        if (find.role === 'che') {
            // 4个方向
            for (let i = find.x + 1; i < 9; i++) {
                const point = [i, find.y];
                const f = this.find(point[0], point[1]);
                if (f && f.player === find.player) {
                    break;
                }

                steps.push(point);
            }

            for (let i = find.y + 1; i < 10; i++) {
                const point = [find.x, i];
                const f = this.find(point[0], point[1]);
                if (f && f.player === find.player) {
                    break;
                }

                steps.push(point);
            }

            for (let i = find.x - 1; i >= 0; i--) {
                const point = [i, find.y];
                const f = this.find(point[0], point[1]);
                if (f && f.player === find.player) {
                    break;
                }

                steps.push(point);
            }

            for (let i = find.y - 1; i >= 0; i--) {
                const point = [find.x, i];
                const f = this.find(point[0], point[1]);
                if (f && f.player === find.player) {
                    break;
                }

                steps.push(point);
            }

            return steps;
        } else if (find.role === 'ma') {
            return [
                [x - 2, y - 1],
                [x - 2, y + 1],
                [x - 1, y - 2],
                [x - 1, y + 2],
                [x + 1, y - 2],
                [x + 1, y + 2],
                [x + 2, y - 1],
                [x + 2, y + 1]
            ];
        } else if (find.role === 'xiang') {
            return [
                [x - 2, y - 2],
                [x + 2, y - 2],
                [x - 2, y + 2],
                [x + 2, y + 2]
            ];
        } else if (find.role === 'shi') {
            return [
                [x - 1, y - 1],
                [x - 1, y + 1],
                [x + 1, y - 1],
                [x + 1, y + 1]
            ];
        } else if (find.role === 'wang') {
            // 4个方向
            return [
                [x, y - 1],
                [x + 1, y],
                [x, y + 1],
                [x - 1, y]
            ];
        } else if (find.role === 'pao') {
            // 4个方向
            for (let i = find.x + 1; i < 9; i++) {
                const point = [i, find.y];
                const f = this.find(point[0], point[1]);
                if (f) {
                    break;
                }

                steps.push(point);
            }

            for (let i = find.y + 1; i < 10; i++) {
                const point = [find.x, i];
                const f = this.find(point[0], point[1]);
                if (f) {
                    break;
                }

                steps.push(point);
            }

            for (let i = find.x - 1; i >= 0; i--) {
                const point = [i, find.y];
                const f = this.find(point[0], point[1]);
                if (f) {
                    break;
                }

                steps.push(point);
            }

            for (let i = find.y - 1; i >= 0; i--) {
                const point = [find.x, i];
                const f = this.find(point[0], point[1]);
                if (f) {
                    break;
                }

                steps.push(point);
            }

            return steps;
        } else if (find.role === 'bing') {
            if (find.player === 'red') {
                if (y > 4) {
                    return [
                        [x, y - 1]
                    ];
                } else {
                    return [
                        [x, y - 1],
                        [x - 1, y],
                        [x + 1, y]
                    ];
                }
            } else {
                if (y < 5) {
                    return [
                        [x, y + 1]
                    ];
                } else {
                    return [
                        [x, y + 1],
                        [x - 1, y],
                        [x + 1, y]
                    ];
                }
            }
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
        this.drawSelect(x, y);
        this.displayAvailableSteps(x, y);
        if (this.selected) {
            // select
            // to
            const moved = this.game.tryMove(this.selected, [x, y]);
            this.selected = null;
            if (moved) {
                this.render();
            }
        } else {
            this.selected = [x, y];
        }
    }

    displayAvailableSteps(x, y) {
        const steps = this.game.getAvailableSteps(x, y);
        if (steps) {
            this.render();
            for (const [x, y] of steps) {
                this.drawSelect(x, y);
            }
        }
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
        const text = this.getName(piece);
        ctx.fillText(text, x * size + offsetX, y * size + offsetY)
    }

    getName(piece) {
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
}

const render = new GameRender(document.querySelector('#main'), game);
render.render();

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
