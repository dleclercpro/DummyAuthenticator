import CallPOST from '../base/CallPOST';

interface Data {
    token: string,
    password: string,
}

export class CallResetPassword extends CallPOST<Data, void> {

    constructor() {
        super(`/reset-password`);
    }
}