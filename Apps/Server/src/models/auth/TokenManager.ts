import { JWT_TOKEN_SECRET, JWT_TOKEN_LONGEVITY } from '../../config/AuthConfig';
import { ErrorInvalidToken } from '../../errors/ServerError';
import { logger } from '../../utils/logger';
import User from './User';
import jwt from 'jsonwebtoken';

export type PasswordRecoveryToken = {
  email: string,
  creationDate: Date,
  expirationDate: Date,
};



// Singleton
class TokenManager {
  private static instance?: TokenManager;

  private secret: string;

  private constructor(secret: string) {
    this.secret = secret;
  }

  public static getInstance() {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager(JWT_TOKEN_SECRET);
    }
    return TokenManager.instance;
  }

  public async decodeToken(token: string) {
    try {
      const content = jwt.verify(token, this.secret);

      return content;
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }

  public async generateForgotPasswordToken(user: User) {
    const now = new Date();

    const content: PasswordRecoveryToken = {
      email: user.getEmail(),
      creationDate: now,
      expirationDate: new Date(now.getTime() + JWT_TOKEN_LONGEVITY.toMs().getAmount()),
    };
    
    const token = await jwt.sign(content, JWT_TOKEN_SECRET);
    logger.debug(`Generated reset password token for user '${user.getEmail()}'.`);

    await user.setToken('forgotPassword', token);

    return token;
  }
}

export default TokenManager.getInstance();