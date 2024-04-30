import { TokenType } from '../constants';

type Token = {
  type: TokenType,
  validTime: number,      // (ms)
  creationDate: number,   // (ms)
  expirationDate: number, // (ms)
};

export type ConfirmEmailToken = Token & {
  email: string,

};

export type ResetPasswordToken = Token & {
  email: string,
};