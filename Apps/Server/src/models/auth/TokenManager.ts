import { JWT_TOKEN_SECRETS, JWT_TOKEN_LONGEVITY } from '../../config/AuthConfig';
import { TokenType } from '../../constants';
import { ErrorInvalidToken } from '../../errors/ServerError';
import { ConfirmEmailToken, ResetPasswordToken } from '../../types/TokenTypes';
import { logger } from '../../utils/logger';
import User from './User';
import jwt, { JwtPayload } from 'jsonwebtoken';



// Singleton
class TokenManager {
  private static instance?: TokenManager;

  private secrets: Record<TokenType, string>;

  private constructor(secrets: Record<TokenType, string>) {
    this.secrets = secrets;
  }

  public static getInstance() {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager(JWT_TOKEN_SECRETS);
    }
    return TokenManager.instance;
  }

  public async verifyToken(token: string, type: TokenType) {
    try {
      const secret = JWT_TOKEN_SECRETS[type];
      
      const content = jwt.verify(token, secret) as JwtPayload;

      return { string: token, content };
      
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }

  public async decodeToken(token: string) {
    try {
      const content = jwt.decode(token) as JwtPayload;

      return { string: token, content };
      
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }

  public async generateEmailConfirmationToken(user: User) {
    const now = new Date();
    const validTime = JWT_TOKEN_LONGEVITY.toMs().getAmount();
    const tokenType = TokenType.ConfirmEmail;

    const content: ConfirmEmailToken = {
      type: tokenType,
      email: user.getEmail().getValue(),
      validTime,
      creationDate: now.getTime(),
      expirationDate: now.getTime() + validTime,
    };
    
    const token = await jwt.sign(content, this.secrets[tokenType]);
    logger.debug(`Generated '${tokenType}' token for user '${user.getEmail()}'.`);

    await user.setToken(tokenType, token);

    return { string: token, content };
  }

  public async generateResetPasswordToken(user: User) {
    const now = new Date();
    const validTime = JWT_TOKEN_LONGEVITY.toMs().getAmount();
    const tokenType = TokenType.ResetPassword;

    const content: ResetPasswordToken = {
      type: tokenType,
      email: user.getEmail().getValue(),
      validTime,
      creationDate: now.getTime(),
      expirationDate: now.getTime() + validTime,
    };
    
    const token = await jwt.sign(content, this.secrets[tokenType]);
    logger.debug(`Generated '${tokenType}' token for user '${user.getEmail()}'.`);

    await user.setToken(tokenType, token);

    return { string: token, content };
  }
}

export default TokenManager.getInstance();