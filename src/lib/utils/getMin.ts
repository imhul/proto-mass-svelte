export const getMin = (a: number, b: number) => {
    let min: number | boolean = false;
    if (a < b) {
        min = a;
    } else if (b < a) {
        min = b;
    }
    return min;
};
