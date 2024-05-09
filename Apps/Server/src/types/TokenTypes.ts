import { TokenType } from '../constants';

export type Token = {
  type: TokenType,
  email: string,          // User e-mail
  validTime: number,      // (ms)
  creationDate: number,   // (ms)
  expirationDate: number, // (ms)
};

export type ConfirmEmailToken = Token & {

};

export type ResetPasswordToken = Token & {

};