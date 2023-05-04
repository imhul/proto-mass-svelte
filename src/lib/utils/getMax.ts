export const getMax = (a: number, b: number) => {
    let max: number | boolean = false;
    if (a < b) {
        max = b;
    } else if (b < a) {
        max = a;
    }
    return max;
};
