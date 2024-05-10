import crypto from 'crypto';
import { JWT_TOKEN_SECRETS, JWT_TOKEN_LONGEVITY } from '../../config/AuthConfig';
import { TokenType } from '../../constants';
import { ErrorExpiredToken, ErrorInvalidToken, ErrorNewerTokenIssued, ErrorTokenAlreadyUsed } from '../../errors/ServerError';
import { ErrorUserDoesNotExist } from '../../errors/UserErrors';
import { TimeUnit } from '../../types/TimeTypes';
import { ConfirmEmailToken, ResetPasswordToken, Token, TokenContent } from '../../types/TokenTypes';
import { logger } from '../../utils/logger';
import TimeDuration from '../units/TimeDuration';
import User from '../user/User';
import jwt from 'jsonwebtoken';
import BlacklistedToken from './BlacklistedToken';
import { hash } from 'bcrypt';



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

    if (await this.isTokenBlacklisted(token)) {
      throw new ErrorTokenAlreadyUsed();
    }

    const isTokenExpired = new Date(token.content.expirationDate) <= now;
    if (isTokenExpired) {
        throw new ErrorExpiredToken();
    }

    // TODO
    const wasNewTokenRequested = false;
    if (wasNewTokenRequested) {
        throw new ErrorNewerTokenIssued();
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

  public async generateTokenId(value: string) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  public async generateEmailConfirmationToken(user: User) {
    return this.generateToken(user, TokenType.ConfirmEmail, {

    }) as Promise<ConfirmEmailToken>;
  }

  public async generateResetPasswordToken(user: User) {
    return this.generateToken(user, TokenType.ResetPassword, {
    
    }) as Promise<ResetPasswordToken>;
  }

  private async generateToken(user: User, type: TokenType, extraContent: object = {}) {
    const now = new Date();
    const validTime = JWT_TOKEN_LONGEVITY.toMs().getAmount();
    
    const content = {
      type,
      validTime,
      creationDate: now.getTime(),
      expirationDate: now.getTime() + validTime,
      email: user.getEmail().getValue(),

      // Add additional content to token
      ...extraContent,
    };

    // We sign and generate the token's string value
    const value = await jwt.sign(content, this.secrets[type]);
    logger.debug(`Generated '${type}' token for user '${user.getEmail().getValue()}'.`);

    return { string: value, content: content };
  }

  public async isTokenBlacklisted(token: Token) {
    const id = await this.generateTokenId(token.string);
    const blacklistedToken = await BlacklistedToken.findById(id);

    return !!blacklistedToken;
  }

  public async blacklistToken(token: Token) {
    const { type } = token.content;
    
    // We use a hashed version of the token's string value as its ID
    const id = await this.generateTokenId(token.string);

    const blacklistedToken = await BlacklistedToken.create(id, type, token.string, token.content);
    logger.debug(`Blacklisted a '${type}' token.`);

    return blacklistedToken;
  }
}

export default TokenManager.getInstance();