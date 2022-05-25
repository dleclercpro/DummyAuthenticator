import CallPOST from '../CallPOST';

interface Data {
    email: string,
    password: string,
}

export class CallSignIn extends CallPOST<Data, void> {

    constructor() {
        super(`sign-in`);
    }
}