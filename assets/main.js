'use strict';

import { sleep } from "./util.js";
import Game from "./game.js";
import GameRender from "./render.js";
import Engine from "./engine.js";

const game = new Game();
game.initGame();

// // 钓鱼马绝杀
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 4, 9);
// game.put('shi', 'red', 3, 9);
// game.put('shi', 'red', 5, 9);
// game.put('shi', 'black', 4, 1);
// game.put('ma', 'black', 6, 7);
// game.put('che', 'black', 5, 4);

// // 拔簧马
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 5, 9);
// game.put('shi', 'red', 3, 9);
// game.put('shi', 'red', 4, 8);
// game.put('shi', 'black', 4, 1);
// game.put('ma', 'black', 7, 8);
// game.put('che', 'black', 6, 8);
// game.put('che', 'red', 0, 9);

// // 立马车
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 4, 7);
// game.put('shi', 'red', 3, 9);
// game.put('shi', 'red', 4, 8);
// game.put('shi', 'black', 4, 1);
// game.put('ma', 'black', 5, 6);
// game.put('che', 'black', 0, 8);
// game.put('che', 'red', 8, 9);

// // 重重炮绝杀
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 4, 9);
// game.put('shi', 'red', 3, 9);
// game.put('shi', 'red', 5, 9);
// game.put('shi', 'black', 4, 1);
// game.put('pao', 'black', 4, 3);
// game.put('pao', 'black', 5, 5);
// game.put('che', 'red', 6, 8);

// // 马后炮绝杀
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 4, 9);
// game.put('shi', 'red', 3, 9);
// game.put('shi', 'red', 5, 9);
// game.put('shi', 'black', 4, 1);
// game.put('pao', 'black', 0, 8);
// game.put('ma', 'black', 3, 6);
// game.put('che', 'red', 6, 8);

// // 白脸将杀
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 3, 9);
// game.put('che', 'black', 6, 0);

// // 白马现蹄
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 4, 9);
// game.put('shi', 'red', 3, 9);
// game.put('shi', 'red', 5, 9);
// game.put('shi', 'black', 4, 1);
// game.put('che', 'black', 0, 9);
// game.put('ma', 'black', 1, 8);
// game.put('pao', 'red', 4, 6);
// game.put('xiang', 'red', 4, 7);
// game.put('xiang', 'black', 4, 2);

// // 双马饮泉
// game.put('wang', 'black', 4, 0);
// game.put('wang', 'red', 4, 9);
// game.put('shi', 'red', 4, 8);
// game.put('shi', 'red', 5, 9);
// game.put('xiang', 'red', 4, 7);
// game.put('xiang', 'red', 6, 9);
// game.put('shi', 'black', 4, 1);
// game.put('ma', 'black', 1, 8);
// game.put('ma', 'black', 3, 6);
// game.put('bing', 'red', 4, 6);
// game.put('xiang', 'red', 4, 7);
// ===========================================
// game.put('pao', 'red', 5, 4);

const render = new GameRender(document.querySelector('#main'), game);
render.setEngine(new Engine({mode: 'L5'}));
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
