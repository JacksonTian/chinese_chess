import Game from "./game.js";

export default class GameRender {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
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

        if (this.selected) {
            const [oldX, oldY] = this.selected;
            const pre = this.game.find(oldX, oldY);
            const current = this.game.find(x, y);
            if (pre && current && pre.player === current.player) {
                this.selected = [x, y];
                return;
            }

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

        const steps = this.game.getSteps(find.player, find.role, find.x, find.y);
        for (const [x, y] of steps) {
            this.drawStep(x, y);
            const newGame = this.game.fork();
            newGame.tryMove([find.x, find.y], [x, y]);
            const opposeSteps = newGame.getAvailableSteps(find.player === 'red' ? 'black' : 'red');
            if (opposeSteps.find((d) => {
                return d.to[0] === x && d.to[1] === y && d.to[2] != 'move';
            })) {
                this.drawWarningStep(x, y);
            }
        }
    }

    drawWarningStep(x, y) {
        const { size, lineWidth, radius, offsetX, offsetY } = this.props;
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
        const text = GameRender.getName(piece);
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

    async replay(records, ms = 1000) {
        for (const record of records) {
            this.game.move(record);
            this.render();
            await sleep(ms);
        }
    }

    move() {
        this.game.autoMove();
        this.render();
    }
}
