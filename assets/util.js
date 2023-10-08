export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function random(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}