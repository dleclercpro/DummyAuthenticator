import { PASSWORD_OPTIONS } from '../config/AuthConfig';
import { isAlphanumerical, isNumerical } from '../libs/string';

interface PasswordOptions {
    minLength?: number,
    minNumbers?: number,
    minSymbols?: number,
}

export const validatePassword = (password: string, options: PasswordOptions = PASSWORD_OPTIONS) => {
    let isValid = true;
    
    if (options.minLength) {
        isValid = password.length >= options.minLength;
    }

    if (isValid && options.minNumbers) {
        isValid = password.split('').filter(c => isNumerical(c)).length >= options.minNumbers;
    }

    if (isValid && options.minSymbols) {
        isValid = password.split('').filter(c => !isAlphanumerical(c)).length >= options.minSymbols;
    }

    return isValid;
}