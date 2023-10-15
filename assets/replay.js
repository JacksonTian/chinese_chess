// 将棋谱与坐标系进行转换的工具方法

import Game from "./game.js";

export function getRoleByName(name) {
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

export function getX(player, x) {
    if (player === 'red') {
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
    } else {
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
}

export function getPosition(number) {
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

    return positionMap[number];
}

export function getDistance(value) {
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
    return distance[value];
}

/**
 * 
 * @param {Game} game 
 * @param {String} record 
 */
export function move(game, record) {
    const [displayName, start, direction, end] = record.split('');
    const role = getRoleByName(displayName);
    const player = game.getCurrentPlayer();
    const find = game.pieces.find((item) => {
        return (item.role === role && item.player === player && getPosition(start) === item.x);
    });
    if (!find) {
        throw new Error(`${record} not found`);
    }
    let x = find.x;
    let y = find.y;
    if (direction === '平') {
        x = getPosition(end);
    } else {
        if (player === 'red') {
            if (direction === '进') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        y = find.y - 1;
                    } else {
                        y = find.y - 2;
                    }
                    x = getPosition(end);
                } else if (role === 'xiang') {
                    x = getPosition(end);
                    y = find.y - 2;
                } else if (role === 'shi') {
                    x = getPosition(end);
                    y = find.y - 1;
                } else {
                    y = find.y - getDistance(end);
                }
            } else if (direction === '退') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        y = find.y + 1;
                    } else {
                        y = find.y + 2;
                    }
                    x = getPosition(end);
                } else if (role === 'xiang') {
                    y = find.y + 2;
                    x = getPosition(end);
                } else if (role === 'shi') {
                    x = getPosition(end);
                    y = find.y + 1;
                } else {
                    y = find.y + getDistance(end);
                }
            }
        } else {
            // 黑方走
            if (direction === '进') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        y = find.y + 1;
                    } else {
                        y = find.y + 2;
                    }
                    x = getPosition(end);
                } else if (role === 'xiang') {
                    y = find.y + 2;
                    x = getPosition(end);
                } else if (role === 'shi') {
                    x = getPosition(end);
                    y = find.y + 1;
                } else {
                    y = find.y + Number(end);
                }
            } else if (direction === '退') {
                if (role === 'ma') {
                    if (Math.abs(find.x - getPosition(end)) === 2) {
                        y = find.y - 1;
                    } else {
                        y = find.y - 2;
                    }
                    x = getPosition(end);
                } else if (role === 'xiang') {
                    y = find.y - 2;
                    x = getPosition(end);
                } else if (role === 'shi') {
                    x = getPosition(end);
                    y = find.y - 1;
                } else {
                    y = find.y - Number(end);
                }
            }
        }
    }

    game.tryMove([find.x, find.y], [x, y]);
}
