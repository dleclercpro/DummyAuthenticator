export const roundDigits = (x: number, n: number) => {
    const power = Math.pow(10, n);

    return Math.round(x * power) / power;
}

export const getRange = (x: number) => {
    return [...Array(x).keys()];
}

export const getEvenRange = (to: number) => {
    return getRange(to).filter(i => i % 2 === 0);
}

export const getUnevenRange = (to: number) => {
    return getRange(to).filter(i => i % 2 !== 0);
}

export const getPairIndices = (n: number) => {
    let indices: [number, number][] = [];

    if (n <= 0) {
        throw new Error('Invalid # of pairs.');
    }

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            indices = [...indices, [i, j]];
        }
    }

    return indices;
};