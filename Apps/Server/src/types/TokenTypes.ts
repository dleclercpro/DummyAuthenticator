import { TokenType } from '../constants';

export type Token<Content = TokenContent> = { string: string, content: Content };

export type TokenContent = {
  type: TokenType,
  email: string,          // User e-mail
  validTime: number,      // (ms)
  creationDate: number,   // (ms)
  expirationDate: number, // (ms)
};

export type ConfirmEmailTokenContent = TokenContent & {

};

export type ResetPasswordTokenContent = TokenContent & {

};

export type ConfirmEmailToken = Token<ConfirmEmailTokenContent>;
export type ResetPasswordToken = Token<ResetPasswordTokenContent>;