import { PasswordRecoveryToken } from '../../../components/pages/reset-password/ResetPassword';
import CallPUT from '../base/CallPUT';

interface Data {
    token: string,
}

interface Response {
    string: string,
    content: PasswordRecoveryToken,
}

export class CallValidateToken extends CallPUT<Data, Response> {

    constructor() {
        super(`/token`);
    }
}