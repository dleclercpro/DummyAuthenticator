import CallPOST from '../base/CallPOST';

export interface Data {
    email: string,
}

export default class CallForgotPassword extends CallPOST<Data, void> {

    constructor() {
        super(`/forgot-password`);
    }
}