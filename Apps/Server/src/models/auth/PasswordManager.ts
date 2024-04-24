import * as bcrypt from 'bcrypt';
import { N_PASSWORD_SALT_ROUNDS, PASSWORD_OPTIONS } from '../../config/AuthConfig';
import { isAlphanumerical, isNumerical } from '../../utils/string';
import User from './User';

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

  public async hash(password: string) {
    const hashedPassword = await bcrypt.hash(password, N_PASSWORD_SALT_ROUNDS);

    return hashedPassword;
  }

  public async reset(user: User, value: string) {
    const now = new Date();
    
    const password = user.getPassword();

    password.setValue(await this.hash(value));
    password.incrementResetCount();
    password.setLastReset(now);
  }

  public async matches(password: string, encryptedPassword: string) {
    return bcrypt.compare(password, encryptedPassword);
  }

  public validate = (password: string) => {
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