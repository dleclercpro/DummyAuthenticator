import CallPUT from '../base/CallPUT';

interface Data {
    email: string,
    password: string,
    staySignedIn: boolean,
}

export class CallSignIn extends CallPUT<Data, void> {

    constructor() {
        super(`sign-in`);
    }
}