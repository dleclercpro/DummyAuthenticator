import jwt from 'jsonwebtoken';
import { TokenType } from '../src/constants';
import { ErrorInvalidToken } from '../src/errors/ServerError';
import TokenManager from '../src/models/auth/TokenManager';
import User from '../src/models/user/User';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  decode: jest.fn(),
  sign: jest.fn(),
}));

jest.mock('../src/config/AuthConfig', () => ({
  JWT_TOKEN_SECRETS: {
    ConfirmEmail: 'secret1',
    ResetPassword: 'secret2',
  },
  JWT_TOKEN_LONGEVITY: {
    toMs: () => ({ getAmount: () => 1000 * 60 * 60 * 24 }), // 24 hours
  },
}));

describe('TokenManager', () => {
  let userMock: User;

  beforeEach(() => {
    userMock = {
      getEmail: jest.fn().mockReturnValue({ getValue: () => 'test@example.com' }),
    } as unknown as User;
    (jwt.sign as jest.Mock).mockImplementation((payload, secret) => Promise.resolve(`mockToken-${payload.type}`));
  });

  test('should generate a confirmation email token', async () => {
    const token = await TokenManager.generateEmailConfirmationToken(userMock);
    expect(token.string).toContain('mockToken-ConfirmEmail');
    expect(jwt.sign).toHaveBeenCalled();
  });

  test('should generate a reset password token', async () => {
    const token = await TokenManager.generateResetPasswordToken(userMock);
    expect(token.string).toContain('mockToken-ResetPassword');
    expect(jwt.sign).toHaveBeenCalled();
  });

  test('should verify a token successfully', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => ({ id: '123', type: TokenType.ConfirmEmail }));
    const result = await TokenManager.verifyToken('validToken', TokenType.ConfirmEmail);
    expect(result.content).toEqual({ id: '123', type: TokenType.ConfirmEmail });
  });

  test('should throw ErrorInvalidToken when verification fails', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
    await expect(TokenManager.verifyToken('invalidToken', TokenType.ConfirmEmail))
      .rejects.toThrow(ErrorInvalidToken);
  });

  test('should decode a token correctly', async () => {
    (jwt.decode as jest.Mock).mockReturnValue({ id: '123', type: TokenType.ConfirmEmail });
    const result = await TokenManager.decodeToken('someToken');
    expect(result.content).toEqual({ id: '123', type: TokenType.ConfirmEmail });
  });
});
