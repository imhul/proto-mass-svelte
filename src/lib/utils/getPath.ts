const lee = (() => {
    let x: number, y: number;

    const pathfinder = (matrixReloaded: any, x1: number, y1: number, x2: number, y2: number) => {
        const toVisit = [[x1, y1]];

        while (toVisit.length) {
            x = toVisit[0][0];
            y = toVisit[0][1];
            for (let i = x - 1; i < x + 2; i++) {
                for (let j = y - 1; j < y + 2; j++) {
                    if (checkPath(matrixReloaded, i, j, x1, y1, 0)) {
                        matrixReloaded[i][j] = matrixReloaded[x][y] + 1;
                        toVisit.push([i, j]);
                    }
                }
            }
            toVisit.shift();
        }

        const shortestPath = getShortestPath(matrixReloaded, x1, y1, x2, y2);
        return shortestPath;
    };

    const getShortestPath = (
        matrixReloaded: any[][],
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) => {
        let previousValue = matrixReloaded && matrixReloaded[x2] && matrixReloaded[x2][y2];
        let x = x2;
        let y = y2;
        const successfulRoute = [];

        while (!(x === x1 && y === y1)) {
            for (let i = x - 1; i < x + 2; i++) {
                for (let j = y - 1; j < y + 2; j++) {
                    if (
                        matrixReloaded[i] &&
                        matrixReloaded[i][j] === previousValue - 1 &&
                        !(i === x && j === y)
                    ) {
                        previousValue = matrixReloaded[i][j];
                        successfulRoute.push({ y: i, x: j });
                        x = i;
                        y = j;
                    } else if (
                        matrixReloaded[x2] &&
                        successfulRoute.length === matrixReloaded[x2][y2] - 1
                    ) {
                        x = x1;
                        y = y1;
                    }
                }
            }
        }
        successfulRoute.unshift({ y: x2, x: y2 }); // Add end point
        successfulRoute.push({ y: x1, x: y1 }); // Add start point
        return successfulRoute.reverse();
    };

    const checkPath = (
        matrixReloaded: { [x: string]: { [x: string]: any } },
        i: number,
        j: number,
        x1: number,
        y1: number,
        value: number
    ) => {
        return (
            matrixReloaded[i] &&
            matrixReloaded[i][j] === value &&
            !(i === x && j === y) &&
            !(i === x1 && j === y1)
        );
    };

    return {
        pathfinder: pathfinder,
        getShortestPath: getShortestPath,
        checkPath: checkPath
    };
})();

export const getPath = (
    matrix: any,
    startY: number,
    startX: number,
    finishY: number,
    finishX: number
) => {
    const path = lee.pathfinder(matrix, startY, startX, finishY, finishX);
    return path;
};
