import CallPOST from '../base/CallPOST';

interface Data {
    email: string,
}

export class CallForgotPassword extends CallPOST<Data, void> {

    constructor() {
        super(`/forgot-password`);
    }
}