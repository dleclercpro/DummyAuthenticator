import CallPOST from '../base/CallPOST';

export interface Data {
    email: string,
    password: string,
}

export default class CallSignUp extends CallPOST<Data, void> {

    constructor() {
        super(`/sign-up`);
    }
}