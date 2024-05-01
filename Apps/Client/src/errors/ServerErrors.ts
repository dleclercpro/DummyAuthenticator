export enum ServerError {
    Unknown = 'UNKNOWN',
    Unauthorized = 'UNAUTHORIZED',

    InvalidCredentials = 'INVALID_CREDENTIALS',
    InvalidEmail = 'INVALID_EMAIL',
    InvalidPassword = 'INVALID_PASSWORD',
    InvalidToken = 'INVALID_TOKEN',
    ExpiredToken = 'EXPIRED_TOKEN',
    UserDoesNotExist = 'USER_DOES_NOT_EXIST',
    UserAlreadyExists = 'USER_ALREADY_EXISTS',
    NoMoreLoginAttempts = 'NO_MORE_LOGIN_ATTEMPTS',
    UnconfirmedEmail = 'UNCONFIRMED_EMAIL',
}

export const translateServerError = (err: ServerError) => {
    switch (err) {
        case ServerError.Unknown:
            return 'An unknown error occurred on the server.';
        case ServerError.Unauthorized:
            return 'You are unauthorized to perform this action.';
        case ServerError.InvalidCredentials:
            return 'The credentials you entered are invalid.';
        case ServerError.InvalidEmail:
            return 'The e-mail you entered seems incorrect.';
        case ServerError.InvalidPassword:
            return 'The password you entered does not fulfill the security requirements. It should be at least 8 characters long and have at least 1 number, and 1 symbol.';
        case ServerError.UserDoesNotExist:
            return 'This user does not exist.';
        case ServerError.UserAlreadyExists:
            return 'This user already exists.';
        case ServerError.InvalidToken:
            return 'The token you tried to use is invalid.';
        case ServerError.ExpiredToken:
            return 'The token you tried to use has expired.';
        case ServerError.NoMoreLoginAttempts:
            return 'You have tried to log in without success too many times. A maximum of {{ MAX_ATTEMPTS }} login failures are allowed per hour.';
        case ServerError.UnconfirmedEmail:
            return 'Please confirm your e-mail address, and then try logging in again.';
        default:
            return 'UNKNOWN_ERROR';
    }
}