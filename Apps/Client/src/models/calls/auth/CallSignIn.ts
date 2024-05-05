import CallPUT from '../base/CallPUT';

export interface Data {
    email: string,
    password: string,
    staySignedIn: boolean,
}

export type ResponseData = {
    isAdmin: boolean,
};

export interface ErrorResponseData {
    attempts: number,
    maxAttempts: number,
}

export default class CallSignIn extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/sign-in`);
    }
}