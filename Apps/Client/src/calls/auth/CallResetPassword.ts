import CallPOST from '../base/CallPOST';

interface Data {
    password: string,
}

export class CallResetPassword extends CallPOST<Data, void> {

    constructor(token: string) {
        super(`/reset-password?token=${token}`);
    }
}