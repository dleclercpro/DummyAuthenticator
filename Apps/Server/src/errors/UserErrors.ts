import User from '../models/auth/User';
import { ServerError } from './ServerError';

export class ErrorUserAlreadyExists extends ServerError {
    public static code = -300;
    
    constructor(user: User) {
        super(ErrorUserAlreadyExists.code, `User already exists: ${user.stringify()}`);
    }
}

export class ErrorUserDoesNotExist extends ServerError {
    public static code = -301;

    constructor(email: string) {
        super(ErrorUserDoesNotExist.code, `User does not exist: ${email}`);
    }
}

export class ErrorUserWrongPassword extends ServerError {
    public static code = -302;
    
    constructor(user: User) {
        super(ErrorUserWrongPassword.code, `Wrong password entered for user: ${user.stringify()}`);
    }
}

export class ErrorEmailNotConfirmed extends ServerError {
    public static code = -303;
    
    constructor(user: User) {
        super(ErrorEmailNotConfirmed.code, `User e-mail is not confirmed: ${user.stringify()}`);
    }
}