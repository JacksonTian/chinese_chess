// 将棋谱与坐标系进行转换的工具方法

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

export function makeStep(find, newX, newY) {
    // 特殊记谱情况：https://www.zhihu.com/question/470070915/answer/2748414695
    const { player, role } = find;
    const name = Game.getName(find);
    let direction;
    let end;
    if (player === 'red') {
        if (find.y === newY) {
            direction = '平';
            end = getX(player, newX);
        } else if (find.y > newY) {
            direction = '进';
            if (role === 'ma') {
                end = getX(player, newX);
            } else if (role === 'pao') {
                end = Math.abs(newY - find.y);
            } else if (role === 'che') {
                end = Math.abs(newY - find.y);
            } else if (role === 'shi') {
                end = getX(player, newX);
            }
        } else {
            direction = '退';
            if (role === 'ma' || role === 'shi') {
                end = getX(player, newX);
            } else if (role === 'pao') {
                end = Math.abs(newY - find.y);
            } else if (role === 'che') {
                end = Math.abs(newY - find.y);
            }
        }

        return `${name}${getX(player, find.x)}${direction}${end}`;
    } else {
        if (find.y === newY) {
            direction = '平';
            end = getX(player, newX);
        } else if (find.y > newY) {
            direction = '退';
            if (role === 'ma') {
                end = getX(player, newX);
            } else if (role === 'pao') {
                end = Math.abs(newY - find.y);
            } else if (role === 'che') {
                end = Math.abs(newY - find.y);
            }
        } else {
            direction = '进';
            if (role === 'ma') {
                end = getX(player, newX);
            } else if (role === 'pao') {
                end = Math.abs(newY - find.y);
            } else if (role === 'che') {
                end = Math.abs(newY - find.y);
            }
        }

        return `${name}${getX(player, find.x)}${direction}${end}`;
    }
}
