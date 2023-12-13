export const stringToBoolean = (str: string) => {
    const newValue = str ? str.toLowerCase() : '';
    
    switch (newValue) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            throw new Error('Invalid boolean string.');
    }
}

export const booleanToString = (bool: boolean) => {
    return bool ? 'true' : 'false';
}

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const getCharCodes = (str: string): number[] => {
    return Array.from(str).map(char => char.charCodeAt(0));
}

export const isNumerical = (str: string): boolean => {
    return str !== '' && getCharCodes(str).every(code => code > 47 && code < 58);
}

export const isAlphabetical = (str: string): boolean => {
    return str !== '' && getCharCodes(str).every(code => (
        (code > 64 && code < 91) ||
        (code > 96 && code < 123)
    ));
}

export const isAlphanumerical = (str: string): boolean => {
    return isAlphabetical(str) || isNumerical(str);
}