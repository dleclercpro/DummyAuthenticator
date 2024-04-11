import { FORGOT_PASSWORD_SECRET, RESET_PASSWORD_TOKEN_VALIDITY } from '../config/AuthConfig';
import { ErrorInvalidToken } from '../errors/ServerError';
import { logger } from '../utils/logger';
import User from './User';
import jwt from 'jsonwebtoken';

type ForgotPasswordToken = {
  email: string,
  creationDate: Date,
  expirationDate: Date,
};



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
    const now = new Date();

    const content: ForgotPasswordToken = {
      email: user.getEmail(),
      creationDate: now,
      expirationDate: new Date(now.getTime() + RESET_PASSWORD_TOKEN_VALIDITY.toMs().getAmount()),
    };
    
    const token = await jwt.sign(content, FORGOT_PASSWORD_SECRET);
    logger.debug(`Generated reset password token for user '${user.getEmail()}'.`);

    await user.setToken('forgotPassword', token);

    return token;
  }

  public async decodeForgotPasswordToken(token: string) {
    try {
      const content = jwt.verify(token, FORGOT_PASSWORD_SECRET) as ForgotPasswordToken;
      logger.debug(`Decoded e-mail contained in reset password token: ${content.email}`);

      return content;
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }
}

export default SecretManager.getInstance();