import { FORGOT_PASSWORD_SECRET } from '../config/AuthConfig';
import { ErrorInvalidToken } from '../errors/ServerError';
import { logger } from '../utils/logger';
import User from './User';
import jwt from 'jsonwebtoken';

// Singleton
class SecretManager {
  private static instance?: SecretManager;

  private constructor() {

  }

  public static getInstance() {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }

  public async generateForgotPasswordToken(user: User) {
    const token = await jwt.sign({ email: user.getEmail() }, FORGOT_PASSWORD_SECRET);
    logger.debug(`Generated reset password token: ${token}`);

    await user.setToken('forgotPassword', token);

    return token;
  }

  public async decodeForgotPasswordToken(token: string) {
    try {
      const content = jwt.verify(token, FORGOT_PASSWORD_SECRET) as { email: string };
      logger.debug(`Decoded e-mail contained in reset password token: ${content.email}`);

      return content;
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }
}

export default SecretManager.getInstance();