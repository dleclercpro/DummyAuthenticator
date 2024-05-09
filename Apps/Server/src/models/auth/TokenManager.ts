import { JWT_TOKEN_SECRETS, JWT_TOKEN_LONGEVITY } from '../../config/AuthConfig';
import { TokenType } from '../../constants';
import { ErrorExpiredToken, ErrorInvalidToken, ErrorNewerTokenIssued, ErrorTokenAlreadyUsed } from '../../errors/ServerError';
import { ErrorUserDoesNotExist } from '../../errors/UserErrors';
import { TimeUnit } from '../../types/TimeTypes';
import { ConfirmEmailToken, ResetPasswordToken, TokenContent } from '../../types/TokenTypes';
import { logger } from '../../utils/logger';
import TimeDuration from '../units/TimeDuration';
import User from '../user/User';
import jwt from 'jsonwebtoken';



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

  public async validateToken(value: string, type: TokenType) {
    const now = new Date();

    const token = await this.verifyToken(value, type);

    const user = await User.findByEmail(token.content.email);
    if (!user) {
      throw new ErrorUserDoesNotExist(token.content.email);
    }

    // FIXME: this only works for the password reset token!
    const lastRequest = user.getPassword().getLastRequest();
    const lastReset = user.getPassword().getLastReset();

    const isTokenExpired = new Date(token.content.expirationDate) <= now;
    if (isTokenExpired) {
        throw new ErrorExpiredToken();
    }

    const wasNewTokenRequested = lastRequest !== null && (new Date(token.content.creationDate) < new Date(lastRequest));
    if (wasNewTokenRequested) {
        throw new ErrorNewerTokenIssued();
    }

    const wasTokenUsed = lastRequest !== null && lastReset !== null && lastRequest < lastReset;
    if (wasTokenUsed) {
        throw new ErrorTokenAlreadyUsed();
    }

    logger.debug(`Received valid token (expiring in ${new TimeDuration(token.content.expirationDate - now.getTime(), TimeUnit.Millisecond).format()}).`);

    return token;
  }

  public async verifyToken(token: string, type: TokenType) {
    try {
      const secret = JWT_TOKEN_SECRETS[type];
      
      const content = jwt.verify(token, secret) as TokenContent;

      return { string: token, content };
      
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }

  public async decodeToken(token: string) {
    try {
      const content = jwt.decode(token) as TokenContent;

      return { string: token, content };
      
    } catch (err: unknown) {
      throw new ErrorInvalidToken();
    }
  }

  public async generateEmailConfirmationToken(user: User) {
    return this.generateToken(user, TokenType.ConfirmEmail, {

    }) as Promise<ConfirmEmailToken>;
  }

  public async generateResetPasswordToken(user: User) {
    return this.generateToken(user, TokenType.ResetPassword, {
    
    }) as Promise<ResetPasswordToken>;
  }

  private async generateToken(user: User, type: TokenType, optsContent: object = {}) {
    const now = new Date();
    const validTime = JWT_TOKEN_LONGEVITY.toMs().getAmount();

    const baseContent: TokenContent = {
      type,
      validTime,
      creationDate: now.getTime(),
      expirationDate: now.getTime() + validTime,
      email: user.getEmail().getValue(),
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