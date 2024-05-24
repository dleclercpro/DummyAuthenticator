export enum UserType {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Regular = 'Regular',
}

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
  TokenAlreadyUsed = 'TOKEN_ALREADY_USED',
  NewerTokenIssued = 'NEWER_TOKEN_EXISTS',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UserDoesNotExist = 'USER_DOES_NOT_EXIST',
  UserIsBanned = 'USER_IS_BANNED',
  NoMoreLoginAttempts = 'NO_MORE_LOGIN_ATTEMPTS',
  UnconfirmedEmail = 'UNCONFIRMED_EMAIL',
  PasswordMustBeDifferent = 'PASSWORD_MUST_BE_DIFFERENT',
}