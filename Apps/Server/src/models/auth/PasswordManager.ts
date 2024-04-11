import { PASSWORD_OPTIONS } from '../../config/AuthConfig';
import { isAlphanumerical, isNumerical } from '../../utils/string';

interface PasswordOptions {
    minLength?: number,
    minNumbers?: number,
    minSymbols?: number,
}



// Singleton
class PasswordManager {
  private static instance?: PasswordManager;

  private options: PasswordOptions;

  private constructor(options: PasswordOptions) {
    this.options = options;
  }

  public static getInstance() {
    if (!PasswordManager.instance) {
      PasswordManager.instance = new PasswordManager(PASSWORD_OPTIONS);
    }
    return PasswordManager.instance;
  }

  public isPasswordValid = (password: string) => {
    let isValid = true;
    
    if (this.options.minLength) {
      isValid = password.length >= this.options.minLength;
    }

    if (isValid && this.options.minNumbers) {
      isValid = password.split('').filter(c => isNumerical(c)).length >= this.options.minNumbers;
    }

    if (isValid && this.options.minSymbols) {
      isValid = password.split('').filter(c => !isAlphanumerical(c)).length >= this.options.minSymbols;
    }

    return isValid;
  }
}

export default PasswordManager.getInstance();