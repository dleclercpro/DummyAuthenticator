import CallPOST from '../CallPOST';

interface Data {
    email: string,
    password: string,
}

export class CallSignUp extends CallPOST<Data, void> {

    constructor() {
        super(`sign-up`);
    }
}