export enum ServerError {
    Unknown = 'UNKNOWN',
    Unauthorized = 'UNAUTHORIZED',

    InvalidCredentials = 'INVALID_CREDENTIALS',
    InvalidEmail = 'INVALID_EMAIL',
    InvalidPassword = 'INVALID_PASSWORD',
    InvalidToken = 'INVALID_TOKEN',
    ExpiredToken = 'EXPIRED_TOKEN',
    UserAlreadyExists = 'USER_ALREADY_EXISTS',
}

export const translateServerError = (err: ServerError) => {
    switch (err) {
        case ServerError.Unknown:
            return 'An unknown error occurred.';
        case ServerError.Unauthorized:
            return 'You are unauthorized to perform this action.';
        case ServerError.InvalidCredentials:
            return 'The credentials you entered are invalid.';
        case ServerError.InvalidEmail:
            return 'The e-mail you entered seems incorrect.';
        case ServerError.InvalidPassword:
            return 'The password you entered does not fulfill the security requirements. It should be at least 8 characters long and have at least 1 number, and 1 symbol.';
        case ServerError.UserAlreadyExists:
            return 'The e-mail you entered is already taken.';
        case ServerError.InvalidToken:
        case ServerError.ExpiredToken:
            return err;
        default:
            return 'UNKNOWN_ERROR';
    }
}