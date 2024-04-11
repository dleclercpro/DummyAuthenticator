export type PasswordRecoveryToken = {
  email: string,
  validTime: number,      // (ms)
  creationDate: number,   // (ms)
  expirationDate: number, // (ms)
};