import { JWT_TOKEN_SECRET, JWT_TOKEN_LONGEVITY } from '../../config/AuthConfig';
import { Token } from '../../constants';
import { ErrorInvalidToken } from '../../errors/ServerError';
import { PasswordRecoveryToken } from '../../types/TokenTypes';
import { logger } from '../../utils/logger';
import User from './User';
import jwt, { JwtPayload } from 'jsonwebtoken';



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
    console.log(token);

    try {
      const content = jwt.verify(token, this.secret) as JwtPayload;

      return { string: token, content };
      
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }

  public async generateForgotPasswordToken(user: User) {
    const now = new Date();
    const validTime = JWT_TOKEN_LONGEVITY.toMs().getAmount();

    const content: PasswordRecoveryToken = {
      email: user.getEmail(),
      validTime,
      creationDate: now.getTime(),
      expirationDate: now.getTime() + validTime,
    };
    
    const token = await jwt.sign(content, JWT_TOKEN_SECRET);
    logger.debug(`Generated reset password token for user '${user.getEmail()}'.`);

    await user.setToken(Token.PasswordRecovery, token);

    return { string: token, content };
  }
}

export default TokenManager.getInstance();