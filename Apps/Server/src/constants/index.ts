export enum TokenType {
  ConfirmEmail = 'ConfirmEmail',
  ResetPassword = 'ResetPassword',
}

export enum ClientError {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidEmail = 'INVALID_EMAIL',
  InvalidPassword = 'INVALID_PASSWORD',
  InvalidToken = 'INVALID_TOKEN',
  ExpiredToken = 'EXPIRED_TOKEN',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UserDoesNotExist = 'USER_DOES_NOT_EXIST',
  NoMoreLoginAttempts = 'NO_MORE_LOGIN_ATTEMPTS',
}