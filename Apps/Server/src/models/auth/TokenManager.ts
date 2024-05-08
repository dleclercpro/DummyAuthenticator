import { JWT_TOKEN_SECRETS, JWT_TOKEN_LONGEVITY } from '../../config/AuthConfig';
import { TokenType } from '../../constants';
import { ErrorInvalidToken } from '../../errors/ServerError';
import { ConfirmEmailToken, ResetPasswordToken, Token } from '../../types/TokenTypes';
import { logger } from '../../utils/logger';
import User from '../user/User';
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
    return this.generateToken(user, TokenType.ConfirmEmail, {
      email: user.getEmail().getValue(),
    }) as Promise<{ string: string, content: ConfirmEmailToken }>;
  }

  public async generateResetPasswordToken(user: User) {
    return this.generateToken(user, TokenType.ResetPassword, {
      email: user.getEmail().getValue(),
    }) as Promise<{ string: string, content: ResetPasswordToken }>;
  }

  private async generateToken(user: User, type: TokenType, optsContent: object = {}) {
    const now = new Date();
    const validTime = JWT_TOKEN_LONGEVITY.toMs().getAmount();

    const baseContent: Token = {
      type,
      validTime,
      creationDate: now.getTime(),
      expirationDate: now.getTime() + validTime,
    };

    // Add token-specific content to base one (and overwrite it if necessary)
    const content = {
      ...baseContent,
      ...optsContent,
    };

    const token = await jwt.sign(content, this.secrets[type]);
    logger.debug(`Generated '${type}' token for user '${user.getEmail().getValue()}'.`);

    return { string: token, content: content };
  }
}

export default TokenManager.getInstance();