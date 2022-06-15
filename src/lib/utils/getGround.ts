import { getRandomInt } from './getRandomInt';

export const getGround = (mapHeight: number, mapWidth: number) => {
    const area = mapWidth * mapHeight;

    return Array.from({ length: area }, (val, k) =>
        k <= mapWidth ||
        k.toString().indexOf('0') > -1 ||
        k.toString().indexOf('9', 1) > -1 ||
        k > area - mapWidth
            ? (val = 1)
            : (val = getRandomInt(2, 9))
    );
};
