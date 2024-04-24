import CallPUT from '../base/CallPUT';

interface Data {
    email: string,
    password: string,
    staySignedIn: boolean,
}

type ResponseData = undefined;

interface ErrorResponseData {
    attempts: number,
    maxAttempts: number,
}

export class CallSignIn extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/sign-in`);
    }
}